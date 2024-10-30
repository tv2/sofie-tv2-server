import { StatusMessageEvent } from '../value-objects/status-message-event'

export interface StatusMessageEventObserver {
  subscribeToStatusMessageEvents(onStatusMessageEventCallback: (statusMessageEvent: StatusMessageEvent) => void): void
}
