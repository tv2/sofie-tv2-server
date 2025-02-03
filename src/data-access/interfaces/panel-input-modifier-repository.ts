import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'

export interface PanelInputModifierRepository {
  getPanelInputModifiers(): Promise<PanelInputModifier[]>
  createPanelInputModifier(panelInputModifier: Omit<PanelInputModifier, 'id'>): Promise<PanelInputModifier>
  deletedPanelInputModifier(panelInputModifierId: string): Promise<void>
}
