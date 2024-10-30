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
    await this.assertNoPanelConfigurationIsUsingThePanelLayoutConfiguration(panelLayoutConfigurationId, 'delete')
    await this.panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(panelLayoutConfigurationId)
    this.panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId)
  }

  private async assertNoPanelConfigurationIsUsingThePanelLayoutConfiguration(panelLayoutConfigurationId: string, operation: string): Promise<void> {
    const panelConfigurationsForPanelLayoutConfiguration: PanelConfiguration[] = await this.panelConfigurationRepository.getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfigurationId)
    if (panelConfigurationsForPanelLayoutConfiguration.length > 0) {
      const panelConfigurationHostNames: string = panelConfigurationsForPanelLayoutConfiguration.map(panelConfiguration => panelConfiguration.hostname).join(', ')
      throw new UnsupportedOperationException(`Can't ${operation} PanelLayoutConfiguration for ${panelLayoutConfigurationId}. It's in use by the ConfigurationPanels [${panelConfigurationHostNames}]`)
    }
  }

  public getPanelConfiguration(panelConfigurationId: string): Promise<PanelConfiguration> {
    return this.panelConfigurationRepository.getPanelConfiguration(panelConfigurationId)
  }

  public getPanelConfigurations(): Promise<PanelConfiguration[]> {
    return this.panelConfigurationRepository.getPanelConfigurations()
  }

  public async createPanelConfiguration(panelConfigurationWithoutId: PanelConfiguration): Promise<void> {
    const panelLayoutConfiguration: PanelLayoutConfiguration = await this.fetchPanelLayoutConfiguration(panelConfigurationWithoutId.panelLayoutConfigurationId, 'create')
    this.assertPanelLayoutConfigurationAndPanelConfigurationCompatibility(panelLayoutConfiguration, panelConfigurationWithoutId, 'create')

    const panelConfiguration: PanelConfiguration = await this.panelConfigurationRepository.createPanelConfiguration(panelConfigurationWithoutId)
    this.panelEventEmitter.emitPanelConfigurationCreated(panelConfiguration)
  }

  private assertPanelLayoutConfigurationAndPanelConfigurationCompatibility(panelLayoutConfiguration: PanelLayoutConfiguration, panelConfiguration: PanelConfiguration, operation: string): void {
    if (panelLayoutConfiguration.model !== panelConfiguration.model || panelLayoutConfiguration.type !== panelConfiguration.type) {
      throw new UnsupportedOperationException(`Unable to ${operation} panel, since panel model and/or panel type are incompatible with the chosen panel layout`)
    }
  }

  private async fetchPanelLayoutConfiguration(panelLayoutConfigurationId: string, operation: string): Promise<PanelLayoutConfiguration> {
    try {
      return await this.panelLayoutConfigurationRepository.getPanelLayoutConfiguration(panelLayoutConfigurationId)
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error
      }
      throw new UnsupportedOperationException(`Can't ${operation} PanelConfiguration. No PanelLayoutConfiguration exist for ${panelLayoutConfigurationId}`)
    }
  }

  public async updatePanelConfiguration(panelConfiguration: PanelConfiguration): Promise<void> {
    const panelLayoutConfiguration: PanelLayoutConfiguration = await this.fetchPanelLayoutConfiguration(panelConfiguration.panelLayoutConfigurationId, 'update')
    this.assertPanelLayoutConfigurationAndPanelConfigurationCompatibility(panelLayoutConfiguration, panelConfiguration, 'update')

    await this.panelConfigurationRepository.updatePanelConfiguration(panelConfiguration)
    this.panelEventEmitter.emitPanelConfigurationUpdated(panelConfiguration)
  }

  public async deletePanelConfiguration(panelConfigurationId: string): Promise<void> {
    await this.panelConfigurationRepository.deletePanelConfiguration(panelConfigurationId)
    this.panelEventEmitter.emitPanelConfigurationDeleted(panelConfigurationId)
  }
}
