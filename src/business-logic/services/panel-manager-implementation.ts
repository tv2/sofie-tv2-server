import { PanelManager } from '../interfaces/panel-manager'
import { Logger } from '../../logger/logger'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelFactory } from '../panel-integrations/panel-factory'
import { Panel } from '../panel-integrations/panel'
import { PanelObserver } from '../interfaces/panel-observer'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelLayoutConfigurationRepository } from '../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelCommandExecutor } from './panel-command-executor'
import { PanelCommand } from '../../model/interfaces/input-configuration'
import { PanelCommandType } from '../../model/enums/panel-enums'
import { PanelGroup } from '../panel-integrations/panel-group'

export class PanelManagerImplementation implements PanelManager {
  private readonly logger: Logger

  private readonly panelGroups: Map<string, PanelGroup> = new Map()
  private readonly panelLayoutConfigurations: Map<string, PanelLayoutConfiguration> = new Map()

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
      this.panelGroups.forEach(panelGroup => panelGroup.updatePanelLayoutConfigurationForPanels(panelLayoutConfiguration))
    })
    this.panelObserver.subscribeToPanelLayoutConfigurationDeleted(panelLayoutConfigurationId => this.panelLayoutConfigurations.delete(panelLayoutConfigurationId))
  }

  private connectToPanel(panelConfiguration: PanelConfiguration): void {
    const existingPanelForHostname: boolean = [...this.panelGroups.values()].some(panelGroup => panelGroup.hasExistingPanelWithHostname(panelConfiguration.hostname))
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

    this.addPanelToGroup(panelConfiguration, panel)
  }

  private addPanelToGroup(panelConfiguration: PanelConfiguration, panel: Panel): void {
    if (!this.panelGroups.has(panelConfiguration.panelGroupId)) {
      const panelGroup: PanelGroup = new PanelGroup(panelConfiguration.panelGroupId)
      panelGroup.registerOnCommand(command => this.handleCommand(command))
      this.panelGroups.set(panelConfiguration.panelGroupId, panelGroup)
    }
    this.panelGroups.get(panelConfiguration.panelGroupId)?.addPanel(panel)
  }

  private handleCommand(command: PanelCommand): void {
    try {
      switch (command.type) {
        case PanelCommandType.ACTION: {
          this.panelCommandExecutor.executeActionCommand(command)
          return
        }
        case PanelCommandType.T_BAR: {
          this.panelCommandExecutor.executeTBarCommand(command)
          return
        }
      }
    } catch (error) {
      this.logger.data(error).error(`Failed executing command: ${JSON.stringify(command)}`)
    }
  }

  private disconnectFromPanel(panelConfigurationId: string): void {
    this.panelGroups.forEach(panelGroup => panelGroup.disconnectPanel(panelConfigurationId))
  }

  private reconnectToPanel(panelConfiguration: PanelConfiguration): void {
    this.disconnectFromPanel(panelConfiguration.id)
    this.connectToPanel(panelConfiguration)
  }

  private async connectToPanels(): Promise<void> {
    const panelConfigurations: PanelConfiguration[] = await this.panelConfigurationRepository.getPanelConfigurations()
    panelConfigurations.forEach(this.connectToPanel.bind(this))
  }
}
