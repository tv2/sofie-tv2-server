import { InputType, KeyEvent, PanelCommandType } from '../enums/panel-enums'
import z, { ZodSchema } from 'zod'
import { Color } from '../enums/color'

export type InputConfiguration = ButtonConfiguration | FaderConfiguration | DisplayConfiguration

export interface BaseInputConfiguration {
  type: InputType
  command: PanelCommand
  color?: Color | undefined
  label?: InputLabel | undefined
}

export interface InputLabel {
  id: string
  text: string
}

export interface ButtonConfiguration extends BaseInputConfiguration {
  type: InputType.BUTTON
  triggersOn: KeyEvent
}

export interface FaderConfiguration extends BaseInputConfiguration {
  type: InputType.FADER
}

export interface DisplayConfiguration extends BaseInputConfiguration {
  type: InputType.DISPLAY
}

export type PanelCommand = ActionPanelCommand | ModifierPanelCommand | TBarPanelCommand | EmptyPanelCommand

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
  panelGroupId?: string
}

export interface TBarPanelCommand extends BasePanelCommand {
  type: PanelCommandType.T_BAR
  value?: number // The number range should go from 0 to 1.000
  shouldExecuteTake?: boolean // Whether a Take needs to be executed in Alba alongside the transition
}

export interface EmptyPanelCommand extends BasePanelCommand {
  type: PanelCommandType.EMPTY
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

export const ZOD_EMPTY_PANEL_COMMAND_SCHEMA: ZodSchema<EmptyPanelCommand> = z.object({
  type: z.literal(PanelCommandType.EMPTY),
})

export const ZOD_PANEL_COMMAND_SCHEMA: ZodSchema<PanelCommand> = z.union([
  ZOD_ACTION_PANEL_COMMAND_SCHEMA,
  ZOD_MODIFIER_PANEL_COMMAND_SCHEMA,
  ZOD_T_BAR_PANEL_COMMAND_SCHEMA,
  ZOD_EMPTY_PANEL_COMMAND_SCHEMA
])

const ZOD_BASE_INPUT_CONFIGURATION_SCHEMA: ZodSchema<BaseInputConfiguration> = z.object({
  type: z.nativeEnum(InputType),
  command: ZOD_PANEL_COMMAND_SCHEMA,
  color: z.nativeEnum(Color).optional(),
  label: z.object({
    id: z.string(),
    text: z.string()
  }).optional()
})

const ZOD_BUTTON_CONFIGURATION_SCHEMA: ZodSchema<ButtonConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.BUTTON),
  triggersOn: z.nativeEnum(KeyEvent),
}))
const ZOD_FADER_CONFIGURATION_SCHEMA: ZodSchema<FaderConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.FADER),
}))

const ZOD_DISPLAY_CONFIGURATION_SCHEMA: ZodSchema<DisplayConfiguration> = z.intersection(ZOD_BASE_INPUT_CONFIGURATION_SCHEMA, z.object({
  type: z.literal(InputType.DISPLAY),
}))

export const ZOD_INPUT_CONFIGURATION_SCHEMA: ZodSchema<InputConfiguration> = z.union([
  ZOD_BUTTON_CONFIGURATION_SCHEMA,
  ZOD_FADER_CONFIGURATION_SCHEMA,
  ZOD_DISPLAY_CONFIGURATION_SCHEMA
])
