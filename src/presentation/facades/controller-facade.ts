import { BaseController } from '../controllers/base-controller'
import { PanelController } from '../controllers/panel-controller'
import { RepositoryFacade } from '../../data-access/repository-facade'
import { ServiceFacade } from '../../business-logic/facades/service-facade'
import { HttpErrorHandler } from '../services/http-error-handler'
import { LoggerFacade } from '../../logger/logger-facade'
import { JsendHttpResponseFormatter } from '../services/jsend-http-response-formatter'
import { SystemInformationController } from '../controllers/system-information-controller'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'

export class ControllerFacade {
  public static getControllers(): BaseController[] {
    return [
      this.createPanelController(),
      this.createSystemInformationController(),
    ]
  }

  private static createPanelController(): PanelController {
    return new PanelController(
      RepositoryFacade.createPhysicalPanelLayoutRepository(),
      ServiceFacade.createPanelService(),
      this.createHttpResponseFormatter(),
      this.createHttpErrorHandler()
    )
  }

  private static createSystemInformationController(): SystemInformationController {
    return new SystemInformationController(
      ServiceFacade.createStatusMessageService(),
      this.createHttpResponseFormatter()
    )
  }

  private static createHttpResponseFormatter(): HttpResponseFormatter {
    return new JsendHttpResponseFormatter()
  }

  private static createHttpErrorHandler(): HttpErrorHandler {
    return new HttpErrorHandler(new JsendHttpResponseFormatter(), LoggerFacade.createLogger())
  }
}
