import { PanelService } from '../interfaces/panel-service'
import { PanelConfigurationService } from '../services/panel-configuration-service'
import { RepositoryFacade } from '../../data-access/repository-facade'
import { PanelManager } from '../interfaces/panel-manager'
import { PanelManagerImplementation } from '../services/panel-manager-implementation'
import { LoggerFacade } from '../../logger/logger-facade'
import { PanelFactory } from '../panel-integrations/panel-factory'
import { StatusMessageService } from '../services/status-message-service'
import { HttpService } from '../interfaces/http-service'
import { FetchHttpService } from '../services/fetch-http-service'
import { JsendHttpService } from '../services/jsend-http-service'
import { AlbaServerHttpService } from '../services/alba-server-http-service'
import { DomainEventFacade } from './domain-event-facade'
import { PanelCommandExecutor } from '../services/panel-command-executor'
import { VideoMixer } from '../panel-integrations/interfaces/video-mixer'
import { AtemVideoMixer } from '../panel-integrations/atem-video-mixer'

export class ServiceFacade {
  public static createPanelService(): PanelService {
    return new PanelConfigurationService(
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      RepositoryFacade.createPanelConfigurationRepository(),
      DomainEventFacade.createPanelEmitter()
    )
  }

  public static createPanelManager(): PanelManager {
    return new PanelManagerImplementation(
      ServiceFacade.createPanelFactory(),
      RepositoryFacade.createPanelConfigurationRepository(),
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      DomainEventFacade.createPanelObserver(),
      ServiceFacade.createPanelCommandExecutor(),
      LoggerFacade.createLogger()
    )
  }

  public static createPanelFactory(): PanelFactory {
    return new PanelFactory(ServiceFacade.createStatusMessageService(), LoggerFacade.createLogger())
  }

  public static createStatusMessageService(): StatusMessageService {
    return new StatusMessageService(
      RepositoryFacade.createStatusMessageRepository(),
      DomainEventFacade.createStatusMessageEmitter(),
      ServiceFacade.createHttpService()
    )
  }

  public static createHttpService(): HttpService {
    return new AlbaServerHttpService(new JsendHttpService(new FetchHttpService()))
  }

  public static createPanelCommandExecutor(): PanelCommandExecutor {
    return new PanelCommandExecutor(
      ServiceFacade.createHttpService(),
      ServiceFacade.createVideoMixer(),
      LoggerFacade.createLogger()
    )
  }

  public static createVideoMixer(): VideoMixer {
    return new AtemVideoMixer(
      ServiceFacade.createStatusMessageService(),
      ServiceFacade.createHttpService(),
      DomainEventFacade.createDeviceObserver(),
      LoggerFacade.createLogger()
    )
  }
}
