import { PanelLayoutConfigurationCreatedEvent } from '../value-objects/panel-event'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'

export interface PanelEventBuilder {
  buildPanelLayoutConfigurationCreatedEvent(panelLayoutConfiguration: PanelLayoutConfiguration): PanelLayoutConfigurationCreatedEvent
}
