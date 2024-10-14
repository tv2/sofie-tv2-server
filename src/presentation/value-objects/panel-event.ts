import { TypedEvent } from './typed-event'
import { EventType, PanelEventType } from '../enum/event-type'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'

export interface PanelEvent extends TypedEvent {
  type: EventType
}

export interface PanelLayoutConfigurationCreatedEvent extends PanelEvent {
  type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_CREATED
  panelLayoutConfiguration: PanelLayoutConfigurationDto
}

export interface PanelLayoutConfigurationDeletedEVent extends PanelEvent {
  type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_DELETED
  panelLayoutConfigurationId: string
}
