import z, { ZodType } from 'zod'

export interface PanelInputModifier {
  id: string
  name: string
}

export const ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITH_OPTIONAL_ID: ZodType<Omit<PanelInputModifier, 'id'> & Partial<PanelInputModifier>> = z.object({
  id: z.string().optional(),
  name: z.string()
})
