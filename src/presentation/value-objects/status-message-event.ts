import { TypedEvent } from './typed-event'
import { StatusMessageEventType } from '../enums/event-type'
import { StatusMessage } from '../../model/entities/status-message'

export interface StatusMessageEvent extends TypedEvent {
  type: StatusMessageEventType.STATUS_MESSAGE
  statusMessage: StatusMessage
}
