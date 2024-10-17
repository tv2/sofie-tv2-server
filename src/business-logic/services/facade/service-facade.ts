import { PanelService } from '../interfaces/panel-service'
import { PanelServiceImplementation } from '../panel-service-implementation'
import { RepositoryFacade } from '../../../data-access/repository-facade'
import { EventEmitterFacade } from '../../../presentation/facades/event-emitter-facade'

export class ServiceFacade {
  public static createPanelService(): PanelService {
    return new PanelServiceImplementation(
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      RepositoryFacade.createPanelConfigurationRepository(),
      EventEmitterFacade.createPanelEventEmitter()
    )
  }
}
