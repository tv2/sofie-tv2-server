import { StatusMessageRepository } from '../../data-access/interfaces/status-message-repository'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusMessageEventEmitter } from './interfaces/status-message-event-emitter'
import { HttpService } from './interfaces/http-service'

const STATUS_MESSAGE_URL: string = '/systemInformation/statusMessages'

export class StatusMessageService {
  public constructor(
    private readonly statusMessageRepository: StatusMessageRepository,
    private readonly statusMessageEventEmitter: StatusMessageEventEmitter,
    private readonly httpService: HttpService
  ) {
  }

  public async getStatusMessages(): Promise<StatusMessage[]> {
    const statusMessageFromAlbaServer: StatusMessage[] = await this.httpService.get(STATUS_MESSAGE_URL) as StatusMessage[]
    const internalStatusMessages: StatusMessage[] = this.statusMessageRepository.getStatusMessages()
    return statusMessageFromAlbaServer.concat(internalStatusMessages)
  }

  public sendStatusMessage(statusMessage: StatusMessage): void {
    this.statusMessageEventEmitter.emitStatusMessage(statusMessage)
    this.statusMessageRepository.updateStatusMessage(statusMessage)
  }
}
