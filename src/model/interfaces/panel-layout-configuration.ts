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

export const ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA: ZodSchema<Omit<PanelLayoutConfiguration, 'id'>> = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.nativeEnum(PanelType),
  model: z.nativeEnum(SkaarhojModel),
  inputConfigurations: z.record(z.string(), ZOD_INPUT_CONFIGURATION_SCHEMA),
})
