import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface PanelConfigurationRepository {
  getPanelConfiguration(panelConfigurationId: string): Promise<PanelConfiguration>
  getPanelConfigurations(): Promise<PanelConfiguration[]>
  createPanelConfiguration(panelConfigurationWithoutId: Omit<PanelConfiguration, 'id'>): Promise<PanelConfiguration>
  getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelConfiguration[]>
}
