import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'

export interface PanelService {
  getPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration>
  getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]>
  createPanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
  updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): Promise<void>
  deletePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void>

  getPanelConfiguration(panelConfigurationId: string): Promise<PanelConfiguration>
  getPanelConfigurations(): Promise<PanelConfiguration[]>
  createPanelConfiguration(panelConfigurationWithoutId: PanelConfiguration): Promise<void>
  updatePanelConfiguration(panelConfiguration: PanelConfiguration): Promise<void>
  deletePanelConfiguration(panelConfigurationId: string): Promise<void>

  getPanelInputModifiers(): Promise<PanelInputModifier[]>
  createPanelInputModifier(panelInputModifier: PanelInputModifier): Promise<void>
  deletedPanelInputModifier(panelInputModifierId: string): Promise<void>
}
