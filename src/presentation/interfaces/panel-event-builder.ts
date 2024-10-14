import {
  PanelConfigurationCreatedEvent,
  PanelLayoutConfigurationCreatedEvent,
  PanelLayoutConfigurationDeletedEvent, PanelLayoutConfigurationUpdatedEvent
} from '../value-objects/panel-event'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

export interface PanelEventBuilder {
  buildPanelLayoutConfigurationCreatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationCreatedEvent
  buildPanelLayoutConfigurationUpdatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationUpdatedEvent
  buildPanelLayoutConfigurationDeletedEvent(panelLayoutConfigurationId: string): PanelLayoutConfigurationDeletedEvent

  buildPanelConfigurationCreatedEvent(panelConfiguration: PanelConfiguration): PanelConfigurationCreatedEvent
}
