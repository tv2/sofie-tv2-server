import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'

export class PanelInputModifierDto {
  public readonly id: string
  public readonly name: string

  public constructor(panelInputModifier: PanelInputModifier) {
    this.id = panelInputModifier.id
    this.name = panelInputModifier.name
  }
}
