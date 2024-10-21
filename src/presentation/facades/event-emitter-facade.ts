import { PanelEventEmitter } from '../../business-logic/services/interfaces/panel-event-emitter'
import { PanelEventService } from '../services/panel-event-service'
import { EventBuilderFacade } from './event-builder-facade'
import { PanelEventObserver } from '../interfaces/panel-event-observer'
import { StatusMessageEventEmitter } from '../../business-logic/services/interfaces/status-message-event-emitter'
import { StatusMessageEventService } from '../services/status-message-event-service'
import { StatusMessageEventObserver } from '../interfaces/status-message-event-observer'

export class EventEmitterFacade {
  public static createPanelEventEmitter(): PanelEventEmitter {
    return PanelEventService.getInstance(EventBuilderFacade.createPanelEventBuilder())
  }

  public static createPanelEventObserver(): PanelEventObserver {
    return PanelEventService.getInstance(EventBuilderFacade.createPanelEventBuilder())
  }

  public static createStatusMessageEventEmitter(): StatusMessageEventEmitter {
    return StatusMessageEventService.getInstance()
  }

  public static createStatusMessageEventObserver(): StatusMessageEventObserver {
    return StatusMessageEventService.getInstance()
  }
}
