import { PanelManager } from '../interfaces/panel-manager'
import { Logger } from '../../logger/logger'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelFactory } from '../panel-integrations/panel-factory'
import { Panel } from '../interfaces/panel'
import { PanelObserver } from '../interfaces/panel-observer'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelLayoutConfigurationRepository } from '../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelCommandExecutor } from './panel-command-executor'
import { ModifierPanelCommand, PanelCommand } from '../../model/interfaces/input-configuration'
import { PanelCommandType } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'

export class PanelManagerImplementation implements PanelManager {
  private readonly logger: Logger

  // The first key is the 'panelGroupId'. The second key is `panelConfigurationId`.
  private readonly panelGroups: Map<string, Map<string, Panel>> = new Map()
  private readonly panelLayoutConfigurations: Map<string, PanelLayoutConfiguration> = new Map()
  private readonly activePanelGroupModifiers: Map<string, Set<string>> = new Map()

  public constructor(
    private readonly panelFactory: PanelFactory,
    private readonly panelConfigurationRepository: PanelConfigurationRepository,
    private readonly panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository,
    private readonly panelObserver: PanelObserver,
    private readonly panelCommandExecutor: PanelCommandExecutor,
    logger: Logger
  ) {
    this.logger = logger.tag(PanelManagerImplementation.name)
  }

  public async initialize(): Promise<void> {
    await this.updatePanelLayoutConfigurations()
    this.subscribeToPanelEvents()
    try {
      await this.connectToPanels()
    } catch (error) {
      this.logger.data(error).error('Error while connecting to Panels')
    }
  }

  private async updatePanelLayoutConfigurations(): Promise<void> {
    const panelLayoutConfigurations: PanelLayoutConfiguration[] = await this.panelLayoutConfigurationRepository.getPanelLayoutConfigurations()
    this.panelLayoutConfigurations.clear()
    panelLayoutConfigurations.forEach(panelLayoutConfiguration => this.panelLayoutConfigurations.set(panelLayoutConfiguration.id, panelLayoutConfiguration))
  }

  private subscribeToPanelEvents(): void {
    this.panelObserver.subscribeToPanelConfigurationCreated(panelConfiguration => this.connectToPanel(panelConfiguration))
    this.panelObserver.subscribeToPanelConfigurationUpdated(panelConfiguration => this.reconnectToPanel(panelConfiguration))
    this.panelObserver.subscribeToPanelConfigurationDeleted(panelConfigurationId => this.disconnectFromPanel(panelConfigurationId))

    this.panelObserver.subscribeToPanelLayoutConfigurationCreated(panelLayoutConfiguration => this.panelLayoutConfigurations.set(panelLayoutConfiguration.id, panelLayoutConfiguration))
    this.panelObserver.subscribeToPanelLayoutConfigurationUpdated((panelLayoutConfiguration) => {
      this.panelLayoutConfigurations.set(panelLayoutConfiguration.id, panelLayoutConfiguration)
      this.panelGroups.forEach((panels) => {
        panels.forEach((panel) => {
          if (panel.getPanelConfiguration().panelLayoutConfigurationId === panelLayoutConfiguration.id) {
            panel.updatePanelLayoutConfiguration(panelLayoutConfiguration)
          }
        })
      })
    })
    this.panelObserver.subscribeToPanelLayoutConfigurationDeleted(panelLayoutConfigurationId => this.panelLayoutConfigurations.delete(panelLayoutConfigurationId))
  }

  private connectToPanel(panelConfiguration: PanelConfiguration): void {
    const existingPanelForHostname: Panel | undefined = [...this.panelGroups.values()].flatMap(panelGroup => [...panelGroup.values()]).find(panel => panel.getPanelConfiguration().hostname === panelConfiguration.hostname)
    if (existingPanelForHostname) {
      this.logger.data(panelConfiguration).warn(`A panel is already connected at ${panelConfiguration.hostname}. Skipping connecting to Panel`)
      return
    }

    const panelLayoutConfiguration: PanelLayoutConfiguration | undefined = this.panelLayoutConfigurations.get(panelConfiguration.panelLayoutConfigurationId)
    if (!panelLayoutConfiguration) {
      this.logger.data(panelConfiguration).warn(`No PanelLayoutConfiguration found for PanelConfiguration ${panelConfiguration.hostname}. Skipping connecting to Panel`)
      return
    }

    const panel: Panel = this.panelFactory.createPanel(panelConfiguration, panelLayoutConfiguration)
    panel.connect()
    panel.registerOnCommand(command => this.handleCommand(command))

    this.setPanel(panelConfiguration, panel)
  }

  private setPanel(panelConfiguration: PanelConfiguration, panel: Panel): void {
    if (!this.panelGroups.has(panelConfiguration.panelGroupId)) {
      this.panelGroups.set(panelConfiguration.panelGroupId, new Map())
    }
    this.panelGroups.get(panelConfiguration.panelGroupId)?.set(panelConfiguration.id, panel)
  }

  private handleCommand(command: PanelCommand): void {
    switch (command.type) {
      case PanelCommandType.ACTION: {
        this.panelCommandExecutor.executeActionCommand(command)
        return
      }
      case PanelCommandType.T_BAR: {
        this.panelCommandExecutor.executeTBarCommand(command)
        return
      }
      case PanelCommandType.MODIFIER: {
        this.updateActiveModifiersFromPanelCommand(command)
        this.updatePanelsWithActiveModifiers()
        return
      }
    }
  }

  private updateActiveModifiersFromPanelCommand(command: ModifierPanelCommand): void {
    if (!command.panelGroupId) {
      throw new UnsupportedOperationException('A modifier command is missing its \'PanelGroupId')
    }
    if (!this.activePanelGroupModifiers.has(command.panelGroupId)) {
      this.activePanelGroupModifiers.set(command.panelGroupId, new Set())
    }
    const activeModifiersForGroup: Set<string> = this.activePanelGroupModifiers.get(command.panelGroupId)!

    const isModifierAlreadyActiveInGroup: boolean = activeModifiersForGroup.has(command.modifier)
    if (isModifierAlreadyActiveInGroup) {
      activeModifiersForGroup.delete(command.modifier)
    } else {
      activeModifiersForGroup.add(command.modifier)
    }
  }

  private updatePanelsWithActiveModifiers(): void {
    this.panelGroups.forEach((panels: Map<string, Panel>, panelGroupId: string) => {
      panels.forEach((panel: Panel) => {
        const activeModifiersForGroup: Set<string> | undefined = this.activePanelGroupModifiers.get(panelGroupId)
        if (!activeModifiersForGroup) {
          return
        }
        panel.updateActiveModifiers(activeModifiersForGroup)
      })
    })
  }

  private disconnectFromPanel(panelConfigurationId: string): void {
    this.panelGroups.forEach((panels) => {
      const panel: Panel | undefined = panels.get(panelConfigurationId)
      if (!panel) {
        return
      }
      panel.disconnect()
      panels.delete(panel.getPanelConfiguration().id)
    })
  }

  private reconnectToPanel(panelConfiguration: PanelConfiguration): void {
    this.panelGroups.forEach((panels) => {
      const panel: Panel | undefined = panels.get(panelConfiguration.id)
      if (panel) {
        panel.disconnect()
        panels.delete(panelConfiguration.id)
      }
      this.connectToPanel(panelConfiguration)
    })
  }

  private async connectToPanels(): Promise<void> {
    const panelConfigurations: PanelConfiguration[] = await this.panelConfigurationRepository.getPanelConfigurations()
    panelConfigurations.forEach(this.connectToPanel.bind(this))
  }
}
