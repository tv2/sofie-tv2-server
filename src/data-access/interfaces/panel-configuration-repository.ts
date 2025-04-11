import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface PanelConfigurationRepository {
  getPanelConfiguration(panelConfigurationId: string): Promise<PanelConfiguration>
  getPanelConfigurations(): Promise<PanelConfiguration[]>
  getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelConfiguration[]>
  createPanelConfiguration(panelConfigurationWithoutId: Omit<PanelConfiguration, 'id'>): Promise<PanelConfiguration>
  updatePanelConfiguration(panelConfiguration: PanelConfiguration): Promise<void>
  deletePanelConfiguration(panelConfigurationId: string): Promise<void>
}
