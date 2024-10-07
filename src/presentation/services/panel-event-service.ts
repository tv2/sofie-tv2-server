import { PanelEventEmitter } from '../../business-logic/services/interfaces/panel-event-emitter'
import { PanelEventObserver } from '../interfaces/panel-event-observer'
import { PanelEvent } from '../value-objects/panel-event'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelEventBuilder } from '../interfaces/panel-event-builder'

export class PanelEventService implements PanelEventEmitter, PanelEventObserver {
  private static instance: PanelEventService

  public static getInstance(panelEventBuilder: PanelEventBuilder): PanelEventService {
    if (!this.instance) {
      this.instance = new PanelEventService(panelEventBuilder)
    }
    return this.instance
  }

  private readonly callbacks: ((panelEvent: PanelEvent) => void)[] = []

  private constructor(private readonly panelEventBuilder: PanelEventBuilder) {
  }

  private emitPanelEvent(panelEvent: PanelEvent): void {
    this.callbacks.forEach(callback => callback(panelEvent))
  }

  public emitPanelLayoutConfigurationCreated(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.emitPanelEvent(this.panelEventBuilder.buildPanelLayoutConfigurationCreatedEvent(panelLayoutConfiguration))
  }

  public subscribeToPanelEvents(onPanelEventCallback: (panelEvent: PanelEvent) => void): void {
    this.callbacks.push(onPanelEventCallback)
  }
}
