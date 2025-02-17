import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelModel, PanelType } from '../../model/enums/panel-enums'

export class PanelConfigurationDto {
  public readonly id: string
  public readonly type: PanelType
  public readonly model: PanelModel
  public readonly hostname: string
  public readonly panelGroupId: string
  public readonly panelLayoutConfigurationId?: string
  public readonly isDisabled: boolean

  public constructor(panelConfiguration: PanelConfiguration) {
    this.id = panelConfiguration.id
    this.type = panelConfiguration.type
    this.model = panelConfiguration.model
    this.hostname = panelConfiguration.hostname
    this.panelGroupId = panelConfiguration.panelGroupId
    this.panelLayoutConfigurationId = panelConfiguration.panelLayoutConfigurationId
    this.isDisabled = panelConfiguration.isDisabled ?? false
  }
}
