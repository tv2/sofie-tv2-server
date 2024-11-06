import { Panel } from './panel'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { InputType, KeyEvent, PanelCommandType, PanelType, SkaarhojModel } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import net, { Socket } from 'node:net'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusCode } from '../../model/enums/status-code'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { InputConfiguration, PanelCommand, TBarPanelCommand } from '../../model/interfaces/input-configuration'

const SKAARHOJ_INPUT_PREFIX: string = 'HWC'

/**
 * Regex to extract the different information in a command received from a Skaarhoj panel.
 *
 * A typical Skaarhoj input looks like this:
 * - HWC#1=UP
 * - HWC#21=DOWN
 * - HWC#50=Abs:50
 *
 * The 'HWC' is a prefix given to all Skaarhoj inputs. That's the 'inputType' group of the regex.
 * The number after the '#' is the id of the input i.e., which id it is. That's the 'id' group of the regex.
 * The right side of the equals sign corresponds to what happened to the input. It could be that the input is a button that was pressed or released.
 * It could also be that the input is a fader, and it tells us what is the new numeric value of the fader. That's the 'data' group of the regex.
 */
const SKAARHOJ_INPUT_REGEX: RegExp = /(?<inputType>[a-z]+)#(?<id>(\d+)|(\d+.\d+))=(?<data>.*)/i

const SKAARHOJ_PORT: number = 9923
const RECONNECTION_TIMEOUT_MS: number = 5000

const DISABLE_SLEEP_MODE_COMMAND: string = 'SleepTimer=0'

enum SkaarhojInputType {
  BUTTON_PRESSED = 'DOWN',
  BUTTON_RELEASED = 'UP',
  FADER = 'ABS'
}

enum TBarDirection {
  UP = 'UP',
  DOWN = 'DOWN'
}

const T_BAR_UPPER_BOUND: number = 1000
const T_BAR_LOWER_BOUND: number = 0

interface SkaarhojInput {
  id: string
  inputType: string
  data: string
}

export class SkaarhojPanel extends Panel {
  private readonly logger: Logger
  private socket: Socket = new Socket()

  private keepAlive: boolean = true
  private reconnectTimeoutIdentifier: NodeJS.Timeout | undefined

  private tBarDirection: TBarDirection = TBarDirection.DOWN

  public constructor(
    panelConfiguration: PanelConfiguration,
    panelLayoutConfiguration: PanelLayoutConfiguration,
    statusMessageService: StatusMessageService,
    logger: Logger
  ) {
    super(panelConfiguration, panelLayoutConfiguration, statusMessageService)
    this.logger = logger.tag(`${SkaarhojPanel.name}:${panelConfiguration.hostname}`)
  }

  protected assertValidPanelConfiguration(panelConfiguration: PanelConfiguration): void {
    if (panelConfiguration.type !== PanelType.SKAARHOJ) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.type}`)
    }
    if (!Object.values(SkaarhojModel).includes(panelConfiguration.model)) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.model}`)
    }
  }

  public connect(): void {
    this.connectToSocket()
  }

  private connectToSocket(): void {
    this.socket = net.createConnection(SKAARHOJ_PORT, this.panelConfiguration.hostname, () => {
      this.logger.info(`Connected to Skaarhoj Panel on ${this.panelConfiguration.hostname}:${SKAARHOJ_PORT}`)
      this.writeCommand('list')
      this.writeCommand(DISABLE_SLEEP_MODE_COMMAND)
      this.sendStatusMessage(this.createConnectionSuccessStatusMessage())
    })

    this.socket.on('error', (error) => {
      this.logger.data(error).error(`Error from ${SkaarhojPanel.name}:${this.panelConfiguration.hostname}`)
      this.sendStatusMessage(this.createUnableToConnectStatusMessage())
    })

    this.socket.setEncoding('utf8')
    this.socket.on('data', (data: Buffer) => {
      const skaarhojInput: SkaarhojInput | undefined = this.parseSkaarhojInput(data.toString())
      if (!skaarhojInput) {
        return
      }
      const inputData: PanelCommand | undefined = this.mapPanelInputToCommand(skaarhojInput)
      if (inputData && this.onCommandCallback) {
        this.onCommandCallback(inputData)
      }
    })

    this.socket.on('close', () => {
      this.logger.debug(`Disconnected from the Skaarhoj Panel at ${this.panelConfiguration.hostname}`)
      this.sendStatusMessage(this.createDisconnectedStatusMessage())
      if (this.keepAlive) {
        this.reconnect()
      }
    })
  }

  private writeCommand(command: string): void {
    // The \n is quite important. Without Skaarhoj won't interpret any of the commands.
    this.socket.write(`${command}\n`)
  }

  private createConnectionSuccessStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Connected to Skaarhoj Panel',
      message: `Successfully connected to Skaarhoj panel at ${this.panelConfiguration.hostname}.`,
      statusCode: StatusCode.GOOD,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private getStatusMessageId(): string {
    return `skaarhoj_${this.panelConfiguration.hostname}`
  }

  private createUnableToConnectStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Skaarhoj panel is unreachable',
      message: `Unable to connect to the Skaarhoj panel at ${this.panelConfiguration.hostname}.`,
      statusCode: StatusCode.WARNING,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private createDisconnectedStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Disconnected from Skaarhoj panel',
      message: `The Skaarhoj panel at ${this.panelConfiguration.hostname} was disconnected.`,
      statusCode: StatusCode.GOOD,
      lastUpdatedTimestamp: Date.now()
    }
  }

  public disconnect(): void {
    this.logger.debug(`Disconnecting from the Skaarhoj Panel at ${this.panelConfiguration.hostname}`)
    this.keepAlive = false
    this.socket.end()
  }

  private reconnect(): void {
    if (this.reconnectTimeoutIdentifier) {
      return
    }
    this.sendStatusMessage(this.createReconnectingStatusMessage())

    this.reconnectTimeoutIdentifier = setTimeout(() => {
      clearTimeout(this.reconnectTimeoutIdentifier)
      this.reconnectTimeoutIdentifier = undefined

      if (this.socket.readyState !== 'closed') {
        return
      }

      this.connectToSocket()
    }, RECONNECTION_TIMEOUT_MS)
  }

  private createReconnectingStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Reconnecting to Skaarhoj panel',
      message: `Attempting to reconnect to the Skaarhoj panel at ${this.panelConfiguration.hostname}`,
      statusCode: StatusCode.WARNING,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private parseSkaarhojInput(textInput: string): SkaarhojInput | undefined {
    // It's possible for Skaarhoj to send an array of commands separated by '\n'. We want the last entry of that array
    const skaarhojInput: SkaarhojInput | undefined = textInput.split('\n').findLast(s => s !== '')?.match(SKAARHOJ_INPUT_REGEX)?.groups as SkaarhojInput | undefined
    if (!skaarhojInput) {
      return
    }

    if (skaarhojInput.inputType !== SKAARHOJ_INPUT_PREFIX) {
      return
    }

    // It's possible to get an id like "3.4", which indicates a specific area of button 3 is pressed.
    // Since we currently treat the areas as one button, we strip the ".x" part of the id.
    const id: string = skaarhojInput.id!.replace(/\..*$/, '')

    return {
      ...skaarhojInput,
      id
    }
  }

  private mapPanelInputToCommand(skaarhojInput: SkaarhojInput): PanelCommand | undefined {
    const inputConfiguration: InputConfiguration | undefined = this.getInputConfiguration(skaarhojInput.id)
    if (!inputConfiguration) {
      return
    }

    switch (inputConfiguration.type) {
      case InputType.BUTTON: {
        const skaarhojKeyEvent: KeyEvent | undefined = this.mapSkaarhojInputToKeyEvent(skaarhojInput)

        if (skaarhojKeyEvent !== inputConfiguration.triggersOn) {
          return
        }

        return inputConfiguration.command
      }
      case InputType.FADER: {
        if (!skaarhojInput.data.toUpperCase().match(SkaarhojInputType.FADER)) {
          return
        }
        const regexMatchForFaderValue: RegExpMatchArray | null | undefined = skaarhojInput.data?.match(/Abs:(?<value>\d+)/)
        if (!regexMatchForFaderValue) {
          return
        }
        const value: number = Number.parseFloat(regexMatchForFaderValue[0].replace('Abs:', ''))
        if (inputConfiguration.command.type !== PanelCommandType.T_BAR) {
          return
        }

        return this.updateTBarCommandWithValues(inputConfiguration.command, value)
      }
    }
  }

  private mapSkaarhojInputToKeyEvent(skaarhojInput: SkaarhojInput): KeyEvent | undefined {
    if (skaarhojInput.data.toUpperCase().match(SkaarhojInputType.BUTTON_PRESSED)) {
      return KeyEvent.PRESSED
    }

    if (skaarhojInput.data.toUpperCase().match(SkaarhojInputType.BUTTON_RELEASED)) {
      return KeyEvent.RELEASED
    }

    return undefined
  }

  private updateTBarCommandWithValues(command: TBarPanelCommand, value: number): PanelCommand {
    const tBarValue: number = this.getTBarPosition(value)
    const tBarDirection: TBarDirection = this.getTBarDirection(tBarValue)
    command.shouldExecuteTake = tBarDirection !== this.tBarDirection
    command.value = tBarValue
    this.tBarDirection = tBarDirection
    return command
  }

  private getTBarPosition(value: number): number {
    const tBarPosition: number = this.tBarDirection === TBarDirection.DOWN ? T_BAR_UPPER_BOUND - value : value
    return Math.min(T_BAR_UPPER_BOUND, Math.max(T_BAR_LOWER_BOUND, tBarPosition))
  }

  private getTBarDirection(directedTBarValue: number): TBarDirection {
    if (directedTBarValue < T_BAR_UPPER_BOUND) {
      return this.tBarDirection
    }
    return this.tBarDirection === TBarDirection.DOWN ? TBarDirection.UP : TBarDirection.DOWN
  }
}
