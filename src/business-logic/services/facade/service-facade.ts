import { PanelService } from '../interfaces/panel-service'
import { PanelConfigurationService } from '../panel-configuration-service'
import { RepositoryFacade } from '../../../data-access/repository-facade'
import { EventEmitterFacade } from '../../../presentation/facades/event-emitter-facade'
import { PanelManager } from '../interfaces/panel-manager'
import { PanelManagerImplementation } from '../panel-manager-implementation'
import { LoggerFacade } from '../../../logger/logger-facade'
import { PanelFactory } from '../panel-factory'

export class ServiceFacade {
  public static createPanelService(): PanelService {
    return new PanelConfigurationService(
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      RepositoryFacade.createPanelConfigurationRepository(),
      EventEmitterFacade.createPanelEventEmitter()
    )
  }

  public static createPanelManager(): PanelManager {
    return new PanelManagerImplementation(
      new PanelFactory(LoggerFacade.createLogger()),
      RepositoryFacade.createPanelConfigurationRepository(),
      LoggerFacade.createLogger()
    )
  }
}
