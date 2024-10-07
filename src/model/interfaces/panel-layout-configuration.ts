import { PANEL_MODEL_SCHEMA, PANEL_TYPE_SCHEMA, PanelModel, PanelType, SkaarhojModel } from '../enums/panel-enums'
import { INPUT_CONFIGURATION_SCHEMA, InputConfiguration, ZOD_INPUT_CONFIGURATION_SCHEMA } from './input-configuration'
import { TObject, Type } from '@fastify/type-provider-typebox'
import z, { ZodSchema } from 'zod'

export interface PanelLayoutConfiguration {
  id: string
  name: string
  type: PanelType
  model: PanelModel
  inputConfigurations: Record<string, InputConfiguration>
}

export const PANEL_LAYOUT_CONFIGURATION_SCHEMA: TObject = Type.Object({
  id: Type.String(),
  name: Type.String(),
  type: PANEL_TYPE_SCHEMA,
  model: PANEL_MODEL_SCHEMA,
  inputConfigurations: Type.Record(Type.String(), INPUT_CONFIGURATION_SCHEMA),
})

export const ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA: ZodSchema<Omit<PanelLayoutConfiguration, 'id'>> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.nativeEnum(PanelType),
  model: z.nativeEnum(SkaarhojModel),
  inputConfigurations: z.record(z.string(), ZOD_INPUT_CONFIGURATION_SCHEMA),
})
