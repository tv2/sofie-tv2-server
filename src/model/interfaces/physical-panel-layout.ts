import { InputType, PanelModel, PanelType } from '../enums/panel-enums'

export interface PhysicalPanelLayout {
  type: PanelType
  model: PanelModel
  inputs: Record<string, InputType>
}
