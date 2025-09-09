import { PanelModel, PanelType, SkaarhojModel } from '../enums/panel-enums'
import { InputConfiguration, ZOD_INPUT_CONFIGURATION_SCHEMA } from './input-configuration'
import z, { ZodSchema } from 'zod'

export interface PanelLayoutConfiguration {
  id: string
  name: string
  type: PanelType
  model: PanelModel
  inputConfigurations: Record<string, InputConfiguration>
}

export const ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID: ZodSchema<Omit<PanelLayoutConfiguration, 'id'>> = z.object({
  name: z.string(),
  type: z.enum(PanelType),
  model: z.enum(SkaarhojModel),
  inputConfigurations: z.record(z.string(), ZOD_INPUT_CONFIGURATION_SCHEMA),
})

export const ZOD_UPDATE_PANEL_LAYOUT_CONFIGURATION_SCHEMA: ZodSchema<Omit<PanelLayoutConfiguration, 'model' | 'type'>> = z.object({
  id: z.string(),
  name: z.string(),
  inputConfigurations: z.record(z.string(), ZOD_INPUT_CONFIGURATION_SCHEMA),
})
