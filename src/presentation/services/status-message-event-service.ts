import { StatusMessageEventEmitter } from '../../business-logic/services/interfaces/status-message-event-emitter'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusMessageEventObserver } from '../interfaces/status-message-event-observer'
import { StatusMessageEvent } from '../value-objects/status-message-event'
import { StatusMessageEventType } from '../enums/event-type'

export class StatusMessageEventService implements StatusMessageEventEmitter, StatusMessageEventObserver {
  private static instance: StatusMessageEventService

  public static getInstance(): StatusMessageEventService {
    if (!this.instance) {
      this.instance = new StatusMessageEventService()
    }
    return this.instance
  }

  private readonly callbacks: ((statusMessageEvent: StatusMessageEvent) => void)[] = []

  private constructor() {
  }

  public emitStatusMessage(statusMessage: StatusMessage): void {
    const statusMessageEvent: StatusMessageEvent = {
      type: StatusMessageEventType.STATUS_MESSAGE,
      timestamp: Date.now(),
      statusMessage
    }

    this.emitEvent(statusMessageEvent)
  }

  private emitEvent(statusMessageEvent: StatusMessageEvent): void {
    this.callbacks.forEach(callback => callback(statusMessageEvent))
  }

  public subscribeToStatusMessageEvents(onStatusMessageEventCallback: (statusMessageEvent: StatusMessageEvent) => void): void {
    this.callbacks.push(onStatusMessageEventCallback)
  }
}
