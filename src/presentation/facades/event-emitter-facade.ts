import { PanelEventEmitter } from '../../business-logic/services/interfaces/panel-event-emitter'
import { PanelEventService } from '../services/panel-event-service'
import { EventBuilderFacade } from './event-builder-facade'
import { PanelEventObserver } from '../interfaces/panel-event-observer'

export class EventEmitterFacade {
  public static createPanelEventEmitter(): PanelEventEmitter {
    return PanelEventService.getInstance(EventBuilderFacade.createPanelEventBuilder())
  }

  public static createPanelEventObserver(): PanelEventObserver {
    return PanelEventService.getInstance(EventBuilderFacade.createPanelEventBuilder())
  }
}
