import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { InputConfiguration, PanelCommand } from '../../model/interfaces/input-configuration'
import { PanelCommandType } from '../../model/enums/panel-enums'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'

const MODIFIER_DELIMITER: string = ';'

export abstract class Panel {
  public abstract connect(): void
  public abstract disconnect(): void
  protected abstract assertValidPanelConfiguration(panelConfiguration: PanelConfiguration): void

  protected activeModifiers: ReadonlySet<string> = new Set()
  private modifierInputKeys: ReadonlySet<string> = new Set()

  protected onCommandCallback?: (command: PanelCommand) => void

  protected constructor(
    protected readonly panelConfiguration: PanelConfiguration,
    protected panelLayoutConfiguration: PanelLayoutConfiguration,
    private readonly statusMessageService: StatusMessageService
  ) {
    this.assertValidPanelConfiguration(panelConfiguration)
    this.updateModifierInputKeys()
  }

  public registerOnCommand(onCommandCallback: (command: PanelCommand) => void): void {
    this.onCommandCallback = onCommandCallback
  }

  public getPanelConfiguration(): PanelConfiguration {
    return this.panelConfiguration
  }

  public updateActiveModifiers(activeModifiers: ReadonlySet<string>): void {
    this.activeModifiers = activeModifiers
  }

  public updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.panelLayoutConfiguration = panelLayoutConfiguration
    this.updateModifierInputKeys()
  }

  private updateModifierInputKeys(): void {
    const keysForModifierInputs: string[] = Object.keys(this.panelLayoutConfiguration.inputConfigurations).filter((key) => {
      const inputConfiguration: InputConfiguration | undefined = this.panelLayoutConfiguration.inputConfigurations[key]
      return inputConfiguration?.command.type === PanelCommandType.MODIFIER
    })
    this.modifierInputKeys = new Set(keysForModifierInputs)
  }

  protected getInputConfiguration(inputConfigurationKey: string): InputConfiguration | undefined {
    if (this.modifierInputKeys.has(inputConfigurationKey)) {
      return this.panelLayoutConfiguration.inputConfigurations[inputConfigurationKey]
    }

    const inputConfigurationKeys: string[] = Object.keys(this.panelLayoutConfiguration.inputConfigurations)
    const inputKey: string | undefined = inputConfigurationKeys.find((key) => {
      const separatedKey: string[] = key.split(MODIFIER_DELIMITER)
      const doesKeyIncludeAllModifiers: boolean = Array.from(this.activeModifiers).every(activeModifier => separatedKey.includes(activeModifier))
      const doesKeyIncludeInput: boolean = separatedKey.some(key => key === inputConfigurationKey)
      const doesKeyHaveOtherModifiersThanActiveModifiers: boolean = separatedKey.length !== this.activeModifiers.size + 1

      return doesKeyIncludeAllModifiers && doesKeyIncludeInput && !doesKeyHaveOtherModifiersThanActiveModifiers
    })

    if (!inputKey) {
      return
    }
    return this.panelLayoutConfiguration.inputConfigurations[inputKey]
  }

  protected sendStatusMessage(statusMessage: StatusMessage): void {
    this.statusMessageService.sendStatusMessage(statusMessage)
  }
}
