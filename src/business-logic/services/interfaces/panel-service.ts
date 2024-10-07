import { PanelLayoutConfiguration } from '../../../model/interfaces/panel-layout-configuration'

export interface PanelService {
  createPanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
}
