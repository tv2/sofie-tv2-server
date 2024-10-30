import { PanelManager } from './interfaces/panel-manager'
import { Logger } from '../../logger/logger'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelFactory } from '../panel-integrations/panel-factory'
import { Panel } from './interfaces/panel'
import { PanelEventObserver } from '../../presentation/interfaces/panel-event-observer'
import {
  PanelConfigurationCreatedEvent,
  PanelConfigurationDeletedEvent,
  PanelEvent
} from '../../presentation/value-objects/panel-event'
import { PanelEventType } from '../../presentation/enums/event-type'

export class PanelManagerImplementation implements PanelManager {
  private readonly logger: Logger

  private readonly panels: Map<string, Panel> = new Map()

  public constructor(
    private readonly panelFactory: PanelFactory,
    private readonly panelConfigurationRepository: PanelConfigurationRepository,
    private readonly panelEventObserver: PanelEventObserver,
    logger: Logger
  ) {
    this.logger = logger.tag(PanelManagerImplementation.name)

    this.panelEventObserver.subscribeToPanelEvents((panelEvent: PanelEvent) => {
      if (this.isPanelConfigurationCreatedEvent(panelEvent)) {
        this.connectToPanel(panelEvent.panelConfiguration)
        return
      }
      if (this.isPanelConfigurationDeletedEvent(panelEvent)) {
        this.disconnectFromPanel(panelEvent.panelConfigurationId)
        return
      }
    })
  }

  private isPanelConfigurationCreatedEvent(panelEvent: PanelEvent): panelEvent is PanelConfigurationCreatedEvent {
    return panelEvent.type === PanelEventType.PANEL_CONFIGURATION_CREATED
  }

  private isPanelConfigurationDeletedEvent(panelEvent: PanelEvent): panelEvent is PanelConfigurationDeletedEvent {
    return panelEvent.type === PanelEventType.PANEL_CONFIGURATION_DELETED
  }

  private disconnectFromPanel(panelConfigurationId: string): void {
    const panel: Panel | undefined = [...this.panels.values()].find(panel => panel.getPanelConfiguration().id === panelConfigurationId)
    if (!panel) {
      return
    }
    panel.disconnect()
    this.panels.delete(panel.getPanelConfiguration().hostname)
  }

  public async initialize(): Promise<void> {
    try {
      await this.connectToPanels()
    } catch (error) {
      this.logger.data(error).error('Error while connecting to Panels')
    }
  }

  private async connectToPanels(): Promise<void> {
    const panelConfigurations: PanelConfiguration[] = await this.panelConfigurationRepository.getPanelConfigurations()
    panelConfigurations.map(this.connectToPanel.bind(this))
  }

  private connectToPanel(panelConfiguration: PanelConfiguration): void {
    if (this.panels.has(panelConfiguration.hostname)) {
      this.logger.data(panelConfiguration).warn(`A panel is already connected at ${panelConfiguration.hostname}. Skipping connecting to Panel`)
      return
    }

    const panel: Panel = this.panelFactory.createPanel(panelConfiguration)
    panel.initialize()

    this.panels.set(panelConfiguration.hostname, panel)
  }
}
