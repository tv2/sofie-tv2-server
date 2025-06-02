import { TypedEvent } from './typed-event'
import { ActionEventType } from '../enums/event-type'
import { Action } from '../../model/entities/action'

export interface ActionEvent extends TypedEvent {
  type: ActionEventType
}

export interface ActionUpdatedEvent extends ActionEvent {
  type: ActionEventType.ACTIONS_UPDATED
  actions: Action[]
  rundownId?: string
}
