import { PanelLayoutConfiguration } from '../../../model/interfaces/panel-layout-configuration'

export interface PanelEventEmitter {
  emitPanelLayoutConfigurationCreated(panelLayoutConfiguration: PanelLayoutConfiguration): void
  emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId: string): void
}
