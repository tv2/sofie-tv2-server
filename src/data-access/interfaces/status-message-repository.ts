import { StatusMessage } from '../../model/entities/status-message'

export interface StatusMessageRepository {
  getStatusMessages(): StatusMessage[]
  updateStatusMessage(statusMessage: StatusMessage): void
}
