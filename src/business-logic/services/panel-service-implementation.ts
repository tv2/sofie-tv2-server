import { PanelEventEmitter } from './interfaces/panel-event-emitter'
import { PanelLayoutConfigurationRepository } from '../../data-access/interfaces/panel-layout-configuration-repository'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelService } from './interfaces/panel-service'

export class PanelServiceImplementation implements PanelService {
  public constructor(private readonly panelLayoutConfigurationRepository: PanelLayoutConfigurationRepository, private readonly panelEventEmitter: PanelEventEmitter) {
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
    await this.panelLayoutConfigurationRepository.deletePanelLayoutConfiguration(panelLayoutConfigurationId)
    this.panelEventEmitter.emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId)
  }
}
