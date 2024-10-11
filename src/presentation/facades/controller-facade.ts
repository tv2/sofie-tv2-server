import { BaseController } from '../controllers/base-controller'
import { PanelController } from '../controllers/panel-controller'
import { RepositoryFacade } from '../../data-access/repository-facade'
import { ServiceFacade } from '../../business-logic/services/facade/service-facade'

export class ControllerFacade {
  public static getControllers(): BaseController[] {
    return [
      new PanelController(RepositoryFacade.createPhysicalPanelLayoutRepository(), ServiceFacade.createPanelService()),
    ]
  }
}
