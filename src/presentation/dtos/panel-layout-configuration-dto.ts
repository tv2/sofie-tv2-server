import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelModel, PanelType } from '../../model/enums/panel-enums'
import { InputConfiguration } from '../../model/interfaces/input-configuration'

export class PanelLayoutConfigurationDto {
  public readonly id: string
  public readonly name: string
  public readonly type: PanelType
  public readonly model: PanelModel
  public readonly inputConfiguration: Record<string, InputConfiguration>

  public constructor(panelLayoutConfiguration: PanelLayoutConfiguration) {
    this.id = panelLayoutConfiguration.id
    this.name = panelLayoutConfiguration.name
    this.type = panelLayoutConfiguration.type
    this.model = panelLayoutConfiguration.model
    this.inputConfiguration = panelLayoutConfiguration.inputConfigurations
  }
}
