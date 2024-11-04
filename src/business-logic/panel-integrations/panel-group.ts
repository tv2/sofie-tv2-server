import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelCommand } from '../../model/interfaces/input-configuration'
import { PanelCommandType } from '../../model/enums/panel-enums'
import { Panel } from './panel'

export class PanelGroup {
  private readonly activeModifiers: Set<string> = new Set()
  private readonly panels: Map<string, Panel> = new Map()

  private onCommandCallback?: (panelCommand: PanelCommand) => void

  public constructor(public readonly id: string) {
  }

  public addPanel(panel: Panel): void {
    this.panels.set(panel.getPanelConfiguration().id, panel)
    panel.registerOnCommand(panelCommand => this.handlePanelCommand(panelCommand))
  }

  private handlePanelCommand(panelCommand: PanelCommand): void {
    if (panelCommand.type !== PanelCommandType.MODIFIER) {
      this.onCommandCallback?.(panelCommand)
      return
    }

    this.updateActiveModifiers(panelCommand.modifier)
    this.updatePanelsWithActiveModifiers()
  }

  private updateActiveModifiers(modifier: string): void {
    if (!this.activeModifiers.has(modifier)) {
      this.activeModifiers.add(modifier)
    } else {
      this.activeModifiers.delete(modifier)
    }
  }

  private updatePanelsWithActiveModifiers(): void {
    this.panels.forEach(panel => panel.updateActiveModifiers(this.activeModifiers))
  }

  public disconnectPanel(panelConfigurationId: string): void {
    const panel: Panel | undefined = this.panels.get(panelConfigurationId)
    if (!panel) {
      return
    }
    panel.disconnect()
    this.panels.delete(panel.getPanelConfiguration().id)
  }

  public updatePanelLayoutConfigurationForPanels(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.panels.forEach((panel) => {
      if (panel.getPanelConfiguration().panelLayoutConfigurationId === panelLayoutConfiguration.id) {
        panel.updatePanelLayoutConfiguration(panelLayoutConfiguration)
      }
    })
  }

  public hasExistingPanelWithHostname(hostname: string): boolean {
    return [...this.panels.values()].some(panel => panel.getPanelConfiguration().hostname === hostname)
  }

  public registerOnCommand(onCommandCallback: (panelCommand: PanelCommand) => void): void {
    this.onCommandCallback = onCommandCallback
  }
}
