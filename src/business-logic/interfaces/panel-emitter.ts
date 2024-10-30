import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface PanelEmitter {
  emitPanelLayoutConfigurationCreated(panelLayoutConfiguration: PanelLayoutConfiguration): void
  emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration: PanelLayoutConfiguration): void
  emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId: string): void

  emitPanelConfigurationCreated(panelConfiguration: PanelConfiguration): void
  emitPanelConfigurationUpdated(panelConfiguration: PanelConfiguration): void
  emitPanelConfigurationDeleted(panelConfigurationId: string): void
}
