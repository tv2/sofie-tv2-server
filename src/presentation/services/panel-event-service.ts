import { PanelEventEmitter } from '../../business-logic/services/interfaces/panel-event-emitter'
import { PanelEventObserver } from '../interfaces/panel-event-observer'
import { PanelEvent } from '../value-objects/panel-event'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelEventBuilder } from '../interfaces/panel-event-builder'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

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

  public emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.emitPanelEvent(this.panelEventBuilder.buildPanelLayoutConfigurationUpdatedEvent(panelLayoutConfiguration))
  }

  public emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId: string): void {
    this.emitPanelEvent(this.panelEventBuilder.buildPanelLayoutConfigurationDeletedEvent(panelLayoutConfigurationId))
  }

  public emitPanelConfigurationCreated(panelConfiguration: PanelConfiguration): void {
    this.emitPanelEvent(this.panelEventBuilder.buildPanelConfigurationCreatedEvent(panelConfiguration))
  }

  public emitPanelConfigurationUpdated(panelConfiguration: PanelConfiguration): void {
    this.emitPanelEvent(this.panelEventBuilder.buildPanelConfigurationUpdateEvent(panelConfiguration))
  }

  public subscribeToPanelEvents(onPanelEventCallback: (panelEvent: PanelEvent) => void): void {
    this.callbacks.push(onPanelEventCallback)
  }
}
