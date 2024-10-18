import { PanelManager } from './interfaces/panel-manager'
import { Logger } from '../../logger/logger'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelFactory } from './panel-factory'
import { Panel } from './interfaces/panel'

export class PanelManagerImplementation implements PanelManager {
  private readonly logger: Logger

  private panels: Panel[] = []

  public constructor(
    private readonly panelFactory: PanelFactory,
    private readonly panelConfigurationRepository: PanelConfigurationRepository,
    logger: Logger
  ) {
    this.logger = logger.tag(PanelManagerImplementation.name)
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
    this.panels = panelConfigurations.map(panelConfiguration => this.panelFactory.createPanel(panelConfiguration))
  }
}
