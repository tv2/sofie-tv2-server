import { BaseController } from '../controllers/base-controller'
import { PanelController } from '../controllers/panel-controller'
import { RepositoryFacade } from '../../data-access/repository-facade'
import { ServiceFacade } from '../../business-logic/services/facade/service-facade'
import { HttpErrorHandler } from '../services/http-error-handler'
import { LoggerFacade } from '../../logger/logger-facade'
import { JsendHttpResponseFormatter } from '../services/jsend-http-response-formatter'

export class ControllerFacade {
  public static getControllers(): BaseController[] {
    return [
      new PanelController(
        RepositoryFacade.createPhysicalPanelLayoutRepository(),
        ServiceFacade.createPanelService(),
        new JsendHttpResponseFormatter(),
        this.createHttpErrorHandler()
      )
    ]
  }

  private static createHttpErrorHandler(): HttpErrorHandler {
    return new HttpErrorHandler(new JsendHttpResponseFormatter(), LoggerFacade.createLogger())
  }
}
