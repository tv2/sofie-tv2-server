import { StatusMessage } from '../../model/entities/status-message'

export interface StatusMessageObserver {
  subscribeToStatusMessages(onStatusMessageEventCallback: (statusMessage: StatusMessage) => void): void
}
