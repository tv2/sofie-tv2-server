import z, { ZodSchema } from 'zod'

export interface PanelInputModifier {
  id: string
  name: string
}

export const ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITHOUT_ID: ZodSchema<Omit<PanelInputModifier, 'id'>> = z.object({
  name: z.string()
})
