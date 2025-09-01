import { Action } from '../../model/entities/action'

export interface ActionEmitter {
  emitActions(actions: Action[], rundownId?: string): void
}
