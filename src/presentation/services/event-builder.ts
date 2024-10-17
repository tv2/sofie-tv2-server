import { PanelEventBuilder } from '../interfaces/panel-event-builder'
import {
  PanelLayoutConfigurationCreatedEvent,
  PanelLayoutConfigurationDeletedEVent,
  PanelLayoutConfigurationUpdatedEvent
} from '../value-objects/panel-event'
import { PanelEventType } from '../enum/event-type'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'

export class EventBuilder implements PanelEventBuilder {
  public buildPanelLayoutConfigurationCreatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationCreatedEvent {
    return {
      type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_CREATED,
      timestamp: Date.now(),
      panelLayoutConfiguration: new PanelLayoutConfigurationDto(panelLayoutConfiguration),
    }
  }

  public buildPanelLayoutConfigurationUpdatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationUpdatedEvent {
    return {
      type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_UPDATED,
      timestamp: Date.now(),
      panelLayoutConfiguration: new PanelLayoutConfigurationDto(panelLayoutConfiguration)
    }
  }

  public buildPanelLayoutConfigurationDeletedEvent(panelLayoutConfigurationId: string): PanelLayoutConfigurationDeletedEVent {
    return {
      type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_DELETED,
      timestamp: Date.now(),
      panelLayoutConfigurationId
    }
  }
}
