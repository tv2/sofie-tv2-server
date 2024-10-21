import { PanelService } from '../interfaces/panel-service'
import { PanelConfigurationService } from '../panel-configuration-service'
import { RepositoryFacade } from '../../../data-access/repository-facade'
import { EventEmitterFacade } from '../../../presentation/facades/event-emitter-facade'
import { PanelManager } from '../interfaces/panel-manager'
import { PanelManagerImplementation } from '../panel-manager-implementation'
import { LoggerFacade } from '../../../logger/logger-facade'
import { PanelFactory } from '../panel-factory'
import { StatusMessageService } from '../../status-message-service'

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
      ServiceFacade.createPanelFactory(),
      RepositoryFacade.createPanelConfigurationRepository(),
      LoggerFacade.createLogger()
    )
  }

  public static createPanelFactory(): PanelFactory {
    return new PanelFactory(ServiceFacade.createStatusMessageService(), LoggerFacade.createLogger())
  }

  public static createStatusMessageService(): StatusMessageService {
    return new StatusMessageService(
      RepositoryFacade.createStatusMessageRepository(),
      EventEmitterFacade.createStatusMessageEventEmitter()
    )
  }
}
