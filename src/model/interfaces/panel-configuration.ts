import { PanelModel, PanelType, SkaarhojModel } from '../enums/panel-enums'
import z, { ZodSchema } from 'zod'

export interface PanelConfiguration {
  id: string
  type: PanelType
  model: PanelModel
  hostname: string
  panelGroupId: string
  panelLayoutConfigurationId?: string
}

export const ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID: ZodSchema<Omit<PanelConfiguration, 'id'>> = z.object({
  type: z.nativeEnum(PanelType),
  model: z.nativeEnum(SkaarhojModel),
  hostname: z.string(),
  panelGroupId: z.string(),
  panelLayoutConfigurationId: z.string().optional(),
})

export const ZOD_PANEL_CONFIGURATION_SCHEMA: ZodSchema<PanelConfiguration> = ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID.and(z.object({
  id: z.string()
}))
