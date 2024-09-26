import { PanelModel, PanelType } from '../enums/panel-enums'
import { ConfiguredInput } from './configured-input'

export interface ConfiguredPanelLayout {
  id: string
  name: string
  type: PanelType
  model: PanelModel
  configuredInputs: Map<string, ConfiguredInput>
}
