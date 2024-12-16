import {
  PanelConfigurationCreatedEvent,
  PanelConfigurationDeletedEvent,
  PanelConfigurationUpdatedEvent,
  PanelInputModifierCreatedEvent, PanelInputModifierDeletedEvent,
  PanelLayoutConfigurationCreatedEvent,
  PanelLayoutConfigurationDeletedEvent,
  PanelLayoutConfigurationUpdatedEvent
} from '../value-objects/panel-event'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'

export interface PanelEventBuilder {
  buildPanelLayoutConfigurationCreatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationCreatedEvent
  buildPanelLayoutConfigurationUpdatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationUpdatedEvent
  buildPanelLayoutConfigurationDeletedEvent(panelLayoutConfigurationId: string): PanelLayoutConfigurationDeletedEvent

  buildPanelConfigurationCreatedEvent(panelConfiguration: PanelConfiguration): PanelConfigurationCreatedEvent
  buildPanelConfigurationUpdateEvent(panelConfiguration: PanelConfiguration): PanelConfigurationUpdatedEvent
  buildPanelConfigurationDeletedEvent(panelConfigurationId: string): PanelConfigurationDeletedEvent

  buildPanelInputModifierCreatedEvent(panelInputModifier: PanelInputModifier): PanelInputModifierCreatedEvent
  buildPanelInputModifierDeletedEvent(panelInputModifierId: string): PanelInputModifierDeletedEvent
}
