import { PanelService } from '../interfaces/panel-service'
import { PanelConfigurationService } from '../panel-configuration-service'
import { RepositoryFacade } from '../../../data-access/repository-facade'
import { EventEmitterFacade } from '../../../presentation/facades/event-emitter-facade'

export class ServiceFacade {
  public static createPanelService(): PanelService {
    return new PanelConfigurationService(
      RepositoryFacade.createPanelLayoutConfigurationRepository(),
      RepositoryFacade.createPanelConfigurationRepository(),
      EventEmitterFacade.createPanelEventEmitter()
    )
  }
}
