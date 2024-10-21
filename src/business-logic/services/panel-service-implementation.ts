import { PanelEventEmitter } from './interfaces/panel-event-emitter'
import { PanelLayoutConfigurationRepository } from '../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelService } from './interfaces/panel-service'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelConfigurationRepository } from '../../data-access/interfaces/panel-configuration-repository'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { NotFoundException } from '../../model/exceptions/not-found-exception'

export class PanelServiceImplementation implements PanelService {
  public constructor(
    private readonly panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository,
    private readonly panelConfigurationRepository: PanelConfigurationRepository,
    private readonly panelEventEmitter: PanelEventEmitter
  ) {
  }

  public getPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration> {
    return this.panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfigurationId)
  }

  public getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]> {
    return this.panelLayoutConfigurationRepository.getPanelLayoutConfigurations()
  }

  public async createPanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void> {
    const panelLayoutConfigurationWithId: PanelLayoutConfiguration = await this.panelLayoutConfigurationRepository.createPanelLayoutConfiguration(panelLayoutConfiguration)
    this.panelEventEmitter.emitPanelLayoutConfigurationCreated(panelLayoutConfigurationWithId)
  }

  public async updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void> {
    await this.panelLayoutConfigurationRepository.updatePanelLayoutConfiguration(panelLayoutConfiguration)
    this.panelEventEmitter.emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration)
  }

  public async deletePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void> {
    await this.assertNoPanelConfigurationIsUsingThePanelLayoutConfiguration(panelLayoutConfigurationId)
    await this.panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(panelLayoutConfigurationId)
    this.panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId)
  }

  private async assertNoPanelConfigurationIsUsingThePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void> {
    const panelConfigurationsForPanelLayoutConfiguration: PanelConfiguration[] = await this.panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfigurationId)
    if (panelConfigurationsForPanelLayoutConfiguration.length > 0) {
      const panelConfigurationIds: string[] = panelConfigurationsForPanelLayoutConfiguration.map(panelConfiguration => panelConfiguration.id)
      throw new UnsupportedOperationException(`Can't delete PanelLayoutConfiguration for ${panelLayoutConfigurationId}. It's in use by the ConfigurationPanels [${panelConfigurationIds}]`)
    }
  }

  public async createPanelConfiguration(panelConfigurationWithoutId: PanelConfiguration): Promise<void> {
    let panelLayoutConfiguration: PanelLayoutConfiguration
    try {
      panelLayoutConfiguration = await this.panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelConfigurationWithoutId.panelLayoutConfigurationId)
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error
      }
      throw new UnsupportedOperationException(`Can't create PanelConfiguration. No PanelLayoutConfiguration exist for ${panelConfigurationWithoutId.panelLayoutConfigurationId}`)
    }

    if (panelLayoutConfiguration.model !== panelConfigurationWithoutId.model || panelLayoutConfiguration.type !== panelConfigurationWithoutId.type) {
      throw new UnsupportedOperationException(
        'Can\'t create PanelConfiguration. Both PanelModel and PanelType needs to match on PanelConfiguration and PanelLayoutConfiguration.'
        + `PanelConfiguration: Model ${panelConfigurationWithoutId.model}, Type: ${panelConfigurationWithoutId.type} - `
        + `PanelLayoutConfiguration: Model: ${panelLayoutConfiguration.model}, Type: ${panelLayoutConfiguration.type}`
      )
    }

    const panelConfiguration: PanelConfiguration = await this.panelConfigurationRepository.createPanelConfiguration(panelConfigurationWithoutId)
    this.panelEventEmitter.emitPanelConfigurationCreated(panelConfiguration)
  }
}
