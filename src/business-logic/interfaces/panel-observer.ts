import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'

export interface PanelObserver {
  subscribeToPanelConfigurationCreated(onPanelConfigurationCreatedCallback: (panelConfiguration: PanelConfiguration) => void): void
  subscribeToPanelConfigurationUpdated(onPanelConfigurationUpdatedCallback: (panelConfiguration: PanelConfiguration) => void): void
  subscribeToPanelConfigurationDeleted(onPanelConfigurationDeletedCallback: (panelConfigurationId: string) => void): void

  subscribeToPanelLayoutConfigurationCreated(onPanelLayoutConfigurationCreatedCallback: (panelLayoutConfiguration: PanelLayoutConfiguration) => void): void
  subscribeToPanelLayoutConfigurationUpdated(onPanelLayoutConfigurationUpdatedCallback: (panelLayoutConfiguration: PanelLayoutConfiguration) => void): void
  subscribeToPanelLayoutConfigurationDeleted(onPanelLayoutConfigurationDeletedCallback: (panelLayoutConfigurationId: string) => void): void

  subscribeToPanelInputModifierCreated(onPanelInputModifierCreated: (panelInputModifier: PanelInputModifier) => void): void
  subscribeToPanelInputModifierDeleted(onPanelInputModifierDeleted: (panelInputModifierId: string) => void): void
}
