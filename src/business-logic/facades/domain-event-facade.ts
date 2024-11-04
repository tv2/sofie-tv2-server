import { EventBus } from '../services/event-bus'
import { PanelObserver } from '../interfaces/panel-observer'
import { PanelEmitter } from '../interfaces/panel-emitter'
import { StatusMessageObserver } from '../interfaces/status-message-observer'
import { StatusMessageEmitter } from '../interfaces/status-message-emitter'

export class DomainEventFacade {
  private static eventBus: EventBus

  public static createPanelObserver(): PanelObserver {
    return this.getEventBus()
  }

  public static createPanelEmitter(): PanelEmitter {
    return this.getEventBus()
  }

  public static createStatusMessageObserver(): StatusMessageObserver {
    return this.eventBus
  }

  public static createStatusMessageEmitter(): StatusMessageEmitter {
    return this.eventBus
  }

  private static getEventBus(): EventBus {
    this.eventBus ??= new EventBus()
    return this.eventBus
  }
}
