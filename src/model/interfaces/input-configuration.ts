import { InputDataType, InputType } from '../enums/panel-enums'
import { HttpMethod } from '../enums/http-method'

export type InputConfiguration = ButtonConfiguration | FaderConfiguration

export interface BaseInputConfiguration {
  type: InputType
  data: InputData
}

export interface ButtonConfiguration extends BaseInputConfiguration {
  type: InputType.BUTTON
  onPress?: boolean
  onRelease?: boolean
}

export interface FaderConfiguration extends BaseInputConfiguration {
  type: InputType.FADER
}

export type InputData = HttpEndpointInputData | ModifierInputData | TBarInputData

export interface BaseInputData {
  type: InputDataType
}

export interface HttpEndpointInputData extends BaseInputData {
  type: InputDataType.HTTP_ENDPOINT
  url: string
  httpMethod: HttpMethod
}

export interface ModifierInputData extends BaseInputData {
  type: InputDataType.MODIFIER
  modifier: string
}

export interface TBarInputData extends BaseInputData {
  type: InputDataType.T_BAR
}
