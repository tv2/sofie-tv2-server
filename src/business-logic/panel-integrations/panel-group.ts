import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelCommand } from '../../model/interfaces/input-configuration'
import { KeyEvent, PanelCommandType } from '../../model/enums/panel-enums'
import { Panel } from './panel'
import { Rundown } from '../../model/entities/rundown'

const MODIFIER_LATCH_THRESHOLD_MS: number = 500

export class PanelGroup {
  private readonly activeModifiers: Map<string, number> = new Map()
  private readonly panels: Map<string, Panel> = new Map()

  private onCommandCallback?: (panelCommand: PanelCommand) => void

  public constructor(public readonly id: string) {
  }

  public addPanel(panel: Panel): void {
    panel.updateActiveModifiers(new Set(this.activeModifiers.keys()))
    this.panels.set(panel.getPanelConfiguration().id, panel)
    panel.registerOnCommand((panelCommand: PanelCommand, keyEvent: KeyEvent | undefined) => this.handlePanelCommand(panelCommand, keyEvent))
  }

  private handlePanelCommand(panelCommand: PanelCommand, keyEvent: KeyEvent | undefined): void {
    if (panelCommand.type !== PanelCommandType.MODIFIER) {
      this.onCommandCallback?.(panelCommand)
      return
    }

    this.updateActiveModifiers(panelCommand.modifier, keyEvent)
    this.updatePanelsWithActiveModifiers()
  }

  private updateActiveModifiers(modifier: string, keyEvent: KeyEvent | undefined): void {
    if (keyEvent === KeyEvent.PRESSED) {
      this.updateModifierForKeyPressed(modifier)
    }

    if (keyEvent === KeyEvent.RELEASED) {
      this.updateModifierForKeyReleased(modifier)
    }
  }

  private updateModifierForKeyPressed(modifier: string): void {
    if (!this.activeModifiers.has(modifier)) {
      this.activeModifiers.set(modifier, Date.now())
      return
    }
    this.activeModifiers.delete(modifier)
  }

  private updateModifierForKeyReleased(modifier: string): void {
    const modifierPressedTimestamp: number | undefined = this.activeModifiers.get(modifier)
    if (!modifierPressedTimestamp) {
      return
    }
    if (Date.now() - modifierPressedTimestamp < MODIFIER_LATCH_THRESHOLD_MS) {
      return
    }
    this.activeModifiers.delete(modifier)
  }

  private updatePanelsWithActiveModifiers(): void {
    this.panels.forEach(panel => panel.updateActiveModifiers(new Set(this.activeModifiers.keys())))
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

  public updateActiveRundown(rundown: Rundown | undefined): void {
    this.panels.forEach(panel => panel.updateActiveRundown(rundown))
  }
}
