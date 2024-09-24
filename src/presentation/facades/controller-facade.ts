import { BaseController } from '../controllers/base-controller'
import { PanelController } from '../controllers/panel-controller'

export class ControllerFacade {
  public static getControllers(): BaseController[] {
    return [
      new PanelController(),
    ]
  }
}
