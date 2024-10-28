import { PanelManager } from './interfaces/panel-manager'
import { Logger } from '../../logger/logger'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelFactory } from '../panel-integrations/panel-factory'
import { Panel } from './interfaces/panel'
import { PanelEventObserver } from '../../presentation/interfaces/panel-event-observer'
import { PanelConfigurationCreatedEvent, PanelEvent } from '../../presentation/value-objects/panel-event'
import { PanelEventType } from '../../presentation/enums/event-type'

export class PanelManagerImplementation implements PanelManager {
  private readonly logger: Logger

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
      }
    })
  }

  private isPanelConfigurationCreatedEvent(panelEvent: PanelEvent): panelEvent is PanelConfigurationCreatedEvent {
    return panelEvent.type === PanelEventType.PANEL_CONFIGURATION_CREATED
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
    const panel: Panel = this.panelFactory.createPanel(panelConfiguration)
    panel.initialize()
  }
}
