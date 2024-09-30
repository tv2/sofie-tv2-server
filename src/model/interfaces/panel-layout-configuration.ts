import { PanelModel, PanelType } from '../enums/panel-enums'
import { InputConfiguration } from './input-configuration'

export interface PanelLayoutConfiguration {
  id: string
  name: string
  type: PanelType
  model: PanelModel
  inputConfigurations: Map<string, InputConfiguration>
}
