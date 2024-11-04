import { TypedEvent } from './typed-event'
import { EventType } from '../enums/event-type'

export interface RundownEvent extends TypedEvent {
  type: EventType
  rundownId: string
}
