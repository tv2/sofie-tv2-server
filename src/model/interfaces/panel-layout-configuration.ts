import { PANEL_MODEL_SCHEMA, PANEL_TYPE_SCHEMA, PanelModel, PanelType } from '../enums/panel-enums'
import { INPUT_CONFIGURATION_SCHEMA, InputConfiguration } from './input-configuration'
import { TObject, Type } from '@fastify/type-provider-typebox'

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
