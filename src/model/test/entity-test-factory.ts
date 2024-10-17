import { PanelConfiguration } from '../interfaces/panel-configuration'
import { PanelType, SkaarhojModel } from '../enums/panel-enums'
import { PanelLayoutConfiguration } from '../interfaces/panel-layout-configuration'

export class EntityTestFactory {
  public static createPanelLayoutConfiguration(panelLayoutConfiguration?: Partial<PanelLayoutConfiguration>): PanelLayoutConfiguration {
    return {
      id: 'randomPanelLayoutConfiguration',
      model: SkaarhojModel.MKT1A,
      type: PanelType.SKAARHOJ,
      name: 'randomName',
      inputConfigurations: {},
      ...panelLayoutConfiguration
    }
  }

  public static createPanelConfiguration(panelConfiguration?: Partial<PanelConfiguration>): PanelConfiguration {
    return {
      id: 'randomPanelConfigurationId',
      model: SkaarhojModel.MKT1A,
      type: PanelType.SKAARHOJ,
      hostname: 'randomHostName',
      panelLayoutConfigurationId: 'randomPanelLayoutConfigurationId',
      ...panelConfiguration
    }
  }
}
