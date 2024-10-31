import { PanelCommandType, InputType } from '../enums/panel-enums'
import z, { ZodSchema } from 'zod'

export type InputConfiguration = ButtonConfiguration | FaderConfiguration

export interface BaseInputConfiguration {
  type: InputType
  command: PanelCommand
}

export interface ButtonConfiguration extends BaseInputConfiguration {
  type: InputType.BUTTON
  onPress?: boolean
  onRelease?: boolean
}

export interface FaderConfiguration extends BaseInputConfiguration {
  type: InputType.FADER
}

export type PanelCommand = ActionPanelCommand | ModifierPanelCommand | TBarPanelCommand

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
  value?: number
}

const ZOD_ACTION_PANEL_COMMAND_SCHEMA: ZodSchema<ActionPanelCommand> = z.object({
  type: z.literal(PanelCommandType.ACTION),
  actionId: z.string(),
  actionArguments: z.unknown().optional()
})

const ZOD_MODIFIER_PANEL_COMMAND_SCHEMA: ZodSchema<ModifierPanelCommand> = z.object({
  type: z.literal(PanelCommandType.MODIFIER),
  modifier: z.string(),
})

export const ZOD_T_BAR_PANEL_COMMAND_SCHEMA: ZodSchema<TBarPanelCommand> = z.object({
  type: z.literal(PanelCommandType.T_BAR),
})

export const ZOD_PANEL_COMMAND_SCHEMA: ZodSchema<PanelCommand> = z.union([
  ZOD_ACTION_PANEL_COMMAND_SCHEMA,
  ZOD_MODIFIER_PANEL_COMMAND_SCHEMA,
  ZOD_T_BAR_PANEL_COMMAND_SCHEMA,
])

const ZOD_BASE_INPUT_CONFIGURATION_SCHEMA: ZodSchema<BaseInputConfiguration> = z.object({
  type: z.nativeEnum(InputType),
  command: ZOD_PANEL_COMMAND_SCHEMA,
})

const ZOD_BUTTON_CONFIGURATION_SCHEMA: ZodSchema<ButtonConfiguration> = z.object({
  type: z.literal(InputType.BUTTON),
  command: ZOD_PANEL_COMMAND_SCHEMA,
  onPress: z.boolean(),
  onRelease: z.boolean(),
})

const ZOD_FADER_CONFIGURATION_SCHEMA: ZodSchema<FaderConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.FADER),
}))

export const ZOD_INPUT_CONFIGURATION_SCHEMA: ZodSchema<InputConfiguration> = z.union([
  ZOD_BUTTON_CONFIGURATION_SCHEMA,
  ZOD_FADER_CONFIGURATION_SCHEMA,
])
