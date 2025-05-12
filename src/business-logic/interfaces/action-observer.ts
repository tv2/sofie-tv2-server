import { Action } from '../../model/entities/action'

export interface ActionObserver {
  subscribeToActionsUpdated(onActionsUpdatedCallback: (actions: Action[]) => void): void
}
