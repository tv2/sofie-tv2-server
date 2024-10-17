import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'

export interface PanelLayoutConfigurationRepository {
  getPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration>
  getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]>
  createPanelLayoutConfiguration(panelLayoutConfiguration: Omit<PanelLayoutConfiguration, 'id'>): Promise<PanelLayoutConfiguration>
  updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
  deletePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void>
}
