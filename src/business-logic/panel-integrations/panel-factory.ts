import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { Panel } from './panel'
import { PanelType } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { SkaarhojPanel } from './skaarhoj-panel'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { ColorConverter } from '../interfaces/color-converter'
import { InvokedActionService } from '../interfaces/invoked-action-service'

export class PanelFactory {
  public constructor(
    private readonly invokedActionService: InvokedActionService,
    private readonly statusMessageService: StatusMessageService,
    private readonly logger: Logger
  ) {}

  public createPanel(
    panelConfiguration: PanelConfiguration,
    colorConverter: ColorConverter,
    panelLayoutConfiguration?: PanelLayoutConfiguration
  ): Panel {
    switch (panelConfiguration.type) {
      case PanelType.SKAARHOJ: {
        return new SkaarhojPanel(
          panelConfiguration,
          this.invokedActionService,
          this.statusMessageService,
          colorConverter,
          this.logger,
          panelLayoutConfiguration
        )
      }
      default: {
        throw new UnsupportedOperationException(`No Panel implementation found for ${panelConfiguration.type}`)
      }
    }
  }
}
