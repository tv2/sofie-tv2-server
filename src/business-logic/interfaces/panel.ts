import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelCommand } from '../../model/interfaces/input-configuration'

export interface Panel {
  initialize(): void
  disconnect(): void
  getPanelConfiguration(): PanelConfiguration
  updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): void
  registerOnCommand(onCommandCallback: (command: PanelCommand) => void): void
}
