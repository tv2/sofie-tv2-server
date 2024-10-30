import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface Panel {
  initialize(): void
  disconnect(): void
  getPanelConfiguration(): PanelConfiguration
}
