import { PanelConfiguration } from '../interfaces/panel-configuration'
import { PanelType, SkaarhojModel } from '../enums/panel-enums'
import { PanelLayoutConfiguration } from '../interfaces/panel-layout-configuration'
import { StatusMessage } from '../entities/status-message'
import { StatusCode } from '../enums/status-code'

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

  public static createStatusMessage(statusMessage?: Partial<StatusMessage>): StatusMessage {
    return {
      id: 'randomStatusMessageId',
      title: 'randomTitle',
      message: 'randomMessage',
      statusCode: StatusCode.UNKNOWN,
      lastUpdatedTimestamp: Date.now(),
      ...statusMessage
    }
  }
}
