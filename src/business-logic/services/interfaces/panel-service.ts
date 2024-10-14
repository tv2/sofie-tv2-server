import { PanelLayoutConfiguration } from '../../../model/interfaces/panel-layout-configuration'

export interface PanelService {
  getPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration>
  getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]>
  createPanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
  updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
  deletePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void>
}
