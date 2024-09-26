import { PanelModel, PanelType } from '../enums/panel-enums'

export interface ConfiguredPanelLayout {
  id: string
  name: string
  type: PanelType
  model: PanelModel
}
