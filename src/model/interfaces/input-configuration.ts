import { InputType, KeyEvent, PanelCommandType } from '../enums/panel-enums'
import z, { ZodType } from 'zod'

export type InputConfiguration = ButtonConfiguration | FaderConfiguration | DisplayConfiguration | ButtonWithDisplayConfiguration

export interface BaseInputConfiguration {
  type: InputType
  command: PanelCommand
  color?: string | undefined
}

export interface ButtonConfiguration extends BaseInputConfiguration {
  type: InputType.BUTTON
  triggersOn: KeyEvent[]
}

export interface FaderConfiguration extends BaseInputConfiguration {
  type: InputType.FADER
}

export interface DisplayConfiguration extends BaseInputConfiguration {
  type: InputType.DISPLAY
  text: string
}

export interface ButtonWithDisplayConfiguration extends BaseInputConfiguration {
  type: InputType.BUTTON_WITH_DISPLAY
  text: string
  triggersOn: KeyEvent[]
}

export type PanelCommand = ActionPanelCommand | ModifierPanelCommand | TBarPanelCommand | DisplayPanelCommand | MacroPanelCommand

export interface BasePanelCommand {
  type: PanelCommandType
}

export interface ActionPanelCommand extends BasePanelCommand {
  type: PanelCommandType.ACTION
  actionId: string
  actionArguments?: unknown
}

export interface ModifierPanelCommand extends BasePanelCommand {
  type: PanelCommandType.MODIFIER
  modifier: string
}

export interface TBarPanelCommand extends BasePanelCommand {
  type: PanelCommandType.T_BAR
  value?: number // The number range should go from 0 to 1000
  shouldExecuteTake?: boolean // Whether a Take needs to be executed in Alba alongside the transition
}

export interface DisplayPanelCommand extends BasePanelCommand {
  type: PanelCommandType.DISPLAY
}

export interface MacroPanelCommand extends BasePanelCommand {
  type: PanelCommandType.MACRO
  macroId: string
}

const ZOD_ACTION_PANEL_COMMAND_SCHEMA: ZodType<ActionPanelCommand> = z.object({
  type: z.literal(PanelCommandType.ACTION),
  actionId: z.string(),
  actionArguments: z.unknown().optional()
})

const ZOD_MODIFIER_PANEL_COMMAND_SCHEMA: ZodType<ModifierPanelCommand> = z.object({
  type: z.literal(PanelCommandType.MODIFIER),
  modifier: z.string(),
})

export const ZOD_T_BAR_PANEL_COMMAND_SCHEMA: ZodType<TBarPanelCommand> = z.object({
  type: z.literal(PanelCommandType.T_BAR),
})

export const ZOD_DISPLAY_PANEL_COMMAND_SCHEMA: ZodType<DisplayPanelCommand> = z.object({
  type: z.literal(PanelCommandType.DISPLAY),
})

export const ZOD_MACRO_COMMAND_SCHEMA: ZodType<MacroPanelCommand> = z.object({
  type: z.literal(PanelCommandType.MACRO),
  macroId: z.string().min(1)
})

export const ZOD_PANEL_COMMAND_SCHEMA: ZodType<PanelCommand> = z.union([
  ZOD_ACTION_PANEL_COMMAND_SCHEMA,
  ZOD_MODIFIER_PANEL_COMMAND_SCHEMA,
  ZOD_T_BAR_PANEL_COMMAND_SCHEMA,
  ZOD_DISPLAY_PANEL_COMMAND_SCHEMA,
  ZOD_MACRO_COMMAND_SCHEMA
])

const ZOD_BASE_INPUT_CONFIGURATION_SCHEMA: ZodType<BaseInputConfiguration> = z.object({
  type: z.enum(InputType),
  command: ZOD_PANEL_COMMAND_SCHEMA,
  color: z.string().optional(),
})

const ZOD_BUTTON_CONFIGURATION_SCHEMA: ZodType<ButtonConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.BUTTON),
  triggersOn: z.enum(KeyEvent).array(),
}))
const ZOD_FADER_CONFIGURATION_SCHEMA: ZodType<FaderConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.FADER),
}))

const ZOD_DISPLAY_CONFIGURATION_SCHEMA: ZodType<DisplayConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.DISPLAY),
  text: z.string()
}))

const ZOD_BUTTON_WITH_DISPLAY_CONFIGURATION_SCHEMA: ZodType<ButtonWithDisplayConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.BUTTON_WITH_DISPLAY),
  text: z.string(),
  triggersOn: z.enum(KeyEvent).array(),
}))

export const ZOD_INPUT_CONFIGURATION_SCHEMA: ZodType<InputConfiguration> = z.union([
  ZOD_BUTTON_CONFIGURATION_SCHEMA,
  ZOD_FADER_CONFIGURATION_SCHEMA,
  ZOD_DISPLAY_CONFIGURATION_SCHEMA,
  ZOD_BUTTON_WITH_DISPLAY_CONFIGURATION_SCHEMA
])
