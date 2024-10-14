import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface PanelConfigurationRepository {
  createPanelConfiguration(panelConfigurationWithoutId: Omit<PanelConfiguration, 'id'>): Promise<PanelConfiguration>
}
