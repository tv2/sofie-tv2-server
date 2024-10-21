import { StatusMessageRepository } from '../data-access/interfaces/status-message-repository'
import { StatusMessage } from '../model/entities/status-message'
import { StatusMessageEventEmitter } from './services/interfaces/status-message-event-emitter'

export class StatusMessageService {
  public constructor(
    private readonly statusMessageRepository: StatusMessageRepository,
    private readonly statusMessageEventEmitter: StatusMessageEventEmitter
  ) {
  }

  public getStatusMessages(): StatusMessage[] {
    return this.statusMessageRepository.getStatusMessages()
  }

  public sendStatusMessage(statusMessage: StatusMessage): void {
    this.statusMessageEventEmitter.emitStatusMessage(statusMessage)
    this.statusMessageRepository.updateStatusMessage(statusMessage)
  }
}
