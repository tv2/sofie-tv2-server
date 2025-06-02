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
import { RundownService } from '../interfaces/rundown-service'
import { RundownHttpService } from '../services/rundown-http-service'
import { ColorConverter } from '../interfaces/color-converter'
import { HexRgbColorConverter } from '../services/hex-rgb-color-converter'
import { InvokedActionService } from '../interfaces/invoked-action-service'
import { InvokedActionStateService } from '../services/invoked-action-state-service'

export class ServiceFacade {
  public static createPanelService(): PanelService {
    return new PanelConfigurationService(
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      RepositoryFacade.createPanelConfigurationRepository(),
      RepositoryFacade.createPanelInputModifierRepository(),
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
      DomainEventFacade.createRundownObserver(),
      ServiceFacade.createRundownService(),
      ServiceFacade.createColorConverter(),
      LoggerFacade.createLogger()
    )
  }

  public static createPanelFactory(): PanelFactory {
    return new PanelFactory(
      ServiceFacade.createInvokedActionService(),
      ServiceFacade.createStatusMessageService(),
      LoggerFacade.createLogger()
    )
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

  public static createRundownService(): RundownService {
    return new RundownHttpService(ServiceFacade.createHttpService())
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

  public static createColorConverter(): ColorConverter {
    return new HexRgbColorConverter()
  }

  public static createInvokedActionService(): InvokedActionService {
    return InvokedActionStateService.getInstance(
      ServiceFacade.createRundownService(),
      DomainEventFacade.createRundownObserver(),
      DomainEventFacade.createActionObserver(),
      DomainEventFacade.createPlayoutContentObserver(),
      ServiceFacade.createHttpService(),
      LoggerFacade.createLogger()
    )
  }
}
