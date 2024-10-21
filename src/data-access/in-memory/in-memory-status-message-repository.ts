import { StatusMessage } from '../../model/entities/status-message'
import { StatusMessageRepository } from '../interfaces/status-message-repository'
import { StatusCode } from '../../model/enums/status-code'

export class InMemoryStatusMessageRepository implements StatusMessageRepository {
  private readonly statusMessages: Map<string, StatusMessage> = new Map()

  public getStatusMessages(): StatusMessage[] {
    return Array.from(this.statusMessages.values())
  }

  public updateStatusMessage(statusMessage: StatusMessage): void {
    if (statusMessage.statusCode !== StatusCode.GOOD) {
      this.statusMessages.set(statusMessage.id, statusMessage)
    } else {
      this.statusMessages.delete(statusMessage.id)
    }
  }
}
