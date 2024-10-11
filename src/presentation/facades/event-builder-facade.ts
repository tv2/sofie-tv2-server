import { PanelEventBuilder } from '../interfaces/panel-event-builder'
import { EventBuilder } from '../services/event-builder'

export class EventBuilderFacade {
  public static createPanelEventBuilder(): PanelEventBuilder {
    return new EventBuilder()
  }
}
