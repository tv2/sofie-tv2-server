import { TypedEvent } from './typed-event'
import { EventType, PanelEventType } from '../enum/event-type'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'
import { PanelConfigurationDto } from '../dtos/panel-configuration-dto'

export interface PanelEvent extends TypedEvent {
  type: EventType
}

export interface PanelLayoutConfigurationCreatedEvent extends PanelEvent {
  type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_CREATED
  panelLayoutConfiguration: PanelLayoutConfigurationDto
}

export interface PanelLayoutConfigurationUpdatedEvent extends PanelEvent {
  type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_UPDATED
  panelLayoutConfiguration: PanelLayoutConfigurationDto
}

export interface PanelLayoutConfigurationDeletedEvent extends PanelEvent {
  type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_DELETED
  panelLayoutConfigurationId: string
}

export interface PanelConfigurationCreatedEvent extends PanelEvent {
  type: PanelEventType.PANEL_CONFIGURATION_CREATED
  panelConfiguration: PanelConfigurationDto
}

export interface PanelConfigurationUpdatedEvent extends PanelEvent {
  type: PanelEventType.PANEL_CONFIGURATION_UPDATED
  panelConfiguration: PanelConfigurationDto
}
