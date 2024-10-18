import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { Panel } from './interfaces/panel'
import { PanelType } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { SkaarhojPanel } from './panel-integrations/skaarhoj-panel'
import { Logger } from '../../logger/logger'

export class PanelFactory {
  public constructor(private readonly logger: Logger) {}

  public createPanel(panelConfiguration: PanelConfiguration): Panel {
    switch (panelConfiguration.type) {
      case PanelType.SKAARHOJ: {
        return new SkaarhojPanel(panelConfiguration, this.logger)
      }
      default: {
        throw new UnsupportedOperationException(`No Panel implementation found for ${panelConfiguration.type}`)
      }
    }
  }
}
