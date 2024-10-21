import { StatusMessage } from '../../../model/entities/status-message'

export interface StatusMessageEventEmitter {
  emitStatusMessage(statusMessage: StatusMessage): void
}
