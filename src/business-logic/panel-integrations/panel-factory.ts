import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { Panel } from '../services/interfaces/panel'
import { PanelType } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { SkaarhojPanel } from './skaarhoj-panel'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'

export class PanelFactory {
  public constructor(private readonly statusMessageService: StatusMessageService, private readonly logger: Logger) {}

  public createPanel(panelConfiguration: PanelConfiguration): Panel {
    switch (panelConfiguration.type) {
      case PanelType.SKAARHOJ: {
        return new SkaarhojPanel(panelConfiguration, this.statusMessageService, this.logger)
      }
      default: {
        throw new UnsupportedOperationException(`No Panel implementation found for ${panelConfiguration.type}`)
      }
    }
  }
}
