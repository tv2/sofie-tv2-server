import { StatusMessage } from '../../model/entities/status-message'

export interface StatusMessageEmitter {
  emitStatusMessage(statusMessage: StatusMessage): void
}
