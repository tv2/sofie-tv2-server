import { INPUT_TYPE_SCHEMA, InputDataType, InputType } from '../enums/panel-enums'
import { HTTP_METHOD_SCHEMA, HttpMethod } from '../enums/http-method'
import { TObject, TSchema, Type } from '@fastify/type-provider-typebox'

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

// ################## Schemas below ##################

const HTTP_ENDPOINT_INPUT_DATA_SCHEMA: TSchema = Type.Object({
  type: Type.Literal(InputDataType.HTTP_ENDPOINT),
  url: Type.String(),
  httpMethod: HTTP_METHOD_SCHEMA,
}, { maxProperties: 3 })

const MODIFIER_INPUT_DATA_SCHEMA: TSchema = Type.Object({
  type: Type.Literal(InputDataType.MODIFIER),
  modifier: Type.String(),
}, { maxProperties: 2 })

export const T_BAR_INPUT_DATA_SCHEMA: TSchema = Type.Object({
  type: Type.Literal(InputDataType.T_BAR),
}, { maxProperties: 1 })

export const INPUT_DATA_SCHEMA: TSchema = Type.Union([
  HTTP_ENDPOINT_INPUT_DATA_SCHEMA,
  MODIFIER_INPUT_DATA_SCHEMA,
  T_BAR_INPUT_DATA_SCHEMA,
])

const BASE_INPUT_CONFIGURATION_SCHEMA: TObject = Type.Object({
  type: INPUT_TYPE_SCHEMA,
  data: INPUT_DATA_SCHEMA,
})

const BUTTON_CONFIGURATION_SCHEMA: TSchema = Type.Composite([
  BASE_INPUT_CONFIGURATION_SCHEMA,
  Type.Object({
    type: Type.Literal(InputType.BUTTON),
    onPress: Type.Optional(Type.Boolean()),
    onRelease: Type.Optional(Type.Boolean()),
  }),
], { maxProperties: 4 })

const FADER_CONFIGURATION_SCHEMA: TSchema = Type.Composite([
  BASE_INPUT_CONFIGURATION_SCHEMA,
  Type.Object({
    type: Type.Literal(InputType.FADER),
  }),
], { maxProperties: 2 })

export const INPUT_CONFIGURATION_SCHEMA: TSchema = Type.Union([
  BUTTON_CONFIGURATION_SCHEMA,
  FADER_CONFIGURATION_SCHEMA,
])
