import { PanelEventBuilder } from '../interfaces/panel-event-builder'
import {
  PanelConfigurationCreatedEvent,
  PanelConfigurationDeletedEvent,
  PanelConfigurationUpdatedEvent,
  PanelLayoutConfigurationCreatedEvent,
  PanelLayoutConfigurationDeletedEvent,
  PanelLayoutConfigurationUpdatedEvent
} from '../value-objects/panel-event'
import { PanelEventType } from '../enum/event-type'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelConfigurationDto } from '../dtos/panel-configuration-dto'

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

  public buildPanelLayoutConfigurationDeletedEvent(panelLayoutConfigurationId: string): PanelLayoutConfigurationDeletedEvent {
    return {
      type: PanelEventType.PANEL_LAYOUT_CONFIGURATION_DELETED,
      timestamp: Date.now(),
      panelLayoutConfigurationId
    }
  }

  public buildPanelConfigurationCreatedEvent(panelConfiguration: PanelConfiguration): PanelConfigurationCreatedEvent {
    return {
      type: PanelEventType.PANEL_CONFIGURATION_CREATED,
      timestamp: Date.now(),
      panelConfiguration: new PanelConfigurationDto(panelConfiguration)
    }
  }

  public buildPanelConfigurationUpdateEvent(panelConfiguration: PanelConfiguration): PanelConfigurationUpdatedEvent {
    return {
      type: PanelEventType.PANEL_CONFIGURATION_UPDATED,
      timestamp: Date.now(),
      panelConfiguration: new PanelConfigurationDto(panelConfiguration)
    }
  }

  public buildPanelConfigurationDeletedEvent(panelConfigurationId: string): PanelConfigurationDeletedEvent {
    return {
      type: PanelEventType.PANEL_CONFIGURATION_DELETED,
      timestamp: Date.now(),
      panelConfigurationId
    }
  }
}
