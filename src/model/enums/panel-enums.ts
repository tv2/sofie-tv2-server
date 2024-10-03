import { TSchema, Type } from '@fastify/type-provider-typebox'

export enum PanelType {
  SKAARHOJ = 'SKAARHOJ',
}

export type PanelModel = SkaarhojModel

export enum SkaarhojModel {
  MK48 = 'SK_MK48',
  MKT1A = 'SK_MKT1A',
}

export enum InputType {
  BUTTON = 'BUTTON',
  BUTTON_WITH_DISPLAY = 'BUTTON_WITH_DISPLAY',
  DISPLAY = 'DISPLAY',
  LED_DISPLAY = 'LED_DISPLAY',
  FADER = 'FADER',
}

export enum InputDataType {
  HTTP_ENDPOINT = 'HTTP_ENDPOINT',
  MODIFIER = 'MODIFIER',
  T_BAR = 'T_BAR',
}

// ################## Schemas below ##################

export const PANEL_TYPE_SCHEMA: TSchema = Type.Enum(PanelType)
export const PANEL_MODEL_SCHEMA: TSchema = Type.Enum(SkaarhojModel)
export const INPUT_TYPE_SCHEMA: TSchema = Type.Enum(InputType)
export const INPUT_DATA_TYPE_SCHEMA: TSchema = Type.Enum(InputDataType)
