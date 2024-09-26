import { ConfiguredPanelLayout } from '../../model/interfaces/configured-panel-layout'

export interface ConfiguredPanelLayoutRepository {
  getConfiguredPanelLayout(configuredPanelLayoutId: string): Promise<ConfiguredPanelLayout>
  getConfiguredPanelLayouts(): Promise<ConfiguredPanelLayout[]>
  createConfiguredPanelLayout(configuredPanelLayout: Omit<ConfiguredPanelLayout, 'id'>): Promise<ConfiguredPanelLayout>
}
