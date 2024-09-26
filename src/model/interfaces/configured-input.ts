import { InputDataType, InputType } from '../enums/panel-enums'
import { HttpMethod } from '../enums/http-method'

export type ConfiguredInput = ConfiguredButtonInput | ConfiguredFaderInput

export interface DefaultConfiguredInput {
  type: InputType
  data: InputData
}

export interface ConfiguredButtonInput extends DefaultConfiguredInput {
  type: InputType.BUTTON
  onPress?: boolean
  onRelease?: boolean
}

export interface ConfiguredFaderInput extends DefaultConfiguredInput {
  type: InputType.FADER
}

export type InputData = HttpEndpointInputData | ModifierInputData | TBarInputData

export interface DefaultInputData {
  type: InputDataType
}

export interface HttpEndpointInputData extends DefaultInputData {
  type: InputDataType.HTTP_ENDPOINT
  url: string
  httpMethod: HttpMethod
}

export interface ModifierInputData extends DefaultInputData {
  type: InputDataType.MODIFIER
  modifier: string
}

export interface TBarInputData extends DefaultInputData {
  type: InputDataType.T_BAR
}
