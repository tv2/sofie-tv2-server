import { PanelEvent } from '../value-objects/panel-event'

export interface PanelEventObserver {
  subscribeToPanelEvents(onPanelEventCallback: (panelEvent: PanelEvent) => void): void
}
