import { Panel } from '../interfaces/panel'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelType, SkaarhojModel } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import net, { Socket } from 'node:net'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusCode } from '../../model/enums/status-code'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'

const SKAARHOJ_PORT: number = 9923
const RECONNECTION_TIMEOUT_MS: number = 5000

const DISABLE_SLEEP_MODE_COMMAND: string = 'SleepTimer=0'

export class SkaarhojPanel implements Panel {
  private readonly logger: Logger
  private socket: Socket = new Socket()

  private keepAlive: boolean = true
  private reconnectionTimeout: NodeJS.Timeout | undefined

  public constructor(
    private readonly panelConfiguration: PanelConfiguration,
    private panelLayoutConfiguration: PanelLayoutConfiguration,
    private readonly statusMessageService: StatusMessageService,
    logger: Logger
  ) {
    this.logger = logger.tag(`${SkaarhojPanel.name}:${panelConfiguration.hostname}`)
    this.assertValidPanelConfiguration(panelConfiguration)
  }

  private assertValidPanelConfiguration(panelConfiguration: PanelConfiguration): void {
    if (panelConfiguration.type !== PanelType.SKAARHOJ) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.type}`)
    }
    if (!Object.values(SkaarhojModel).includes(panelConfiguration.model)) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.model}`)
    }
  }

  public initialize(): void {
    this.connectToSocket()
  }

  private connectToSocket(): void {
    this.socket = net.createConnection(SKAARHOJ_PORT, this.panelConfiguration.hostname, () => {
      this.logger.info(`Connected to Skaarhoj Panel on ${this.panelConfiguration.hostname}:${SKAARHOJ_PORT}`)
      this.writeCommand('list')
      this.writeCommand(DISABLE_SLEEP_MODE_COMMAND)
      this.statusMessageService.sendStatusMessage(this.createConnectionSuccessStatusMessage())
    })

    this.socket.on('error', (error) => {
      this.logger.data(error).error(`Error from ${SkaarhojPanel.name}:${this.panelConfiguration.hostname}`)
      this.statusMessageService.sendStatusMessage(this.createUnableToConnectStatusMessage())
    })

    this.socket.setEncoding('utf8')
    this.socket.on('data', (data) => {
      this.logger.data(data).info(`Received input from ${SkaarhojPanel.name}:${this.panelConfiguration.hostname}`)
    })

    this.socket.on('close', () => {
      this.logger.debug(`Disconnected from the Skaarhoj Panel at ${this.panelConfiguration.hostname}`)
      this.statusMessageService.sendStatusMessage(this.createDisconnectedStatusMessage())
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
      message: `Successfully connected to Skaarhoj panel at ${this.panelConfiguration.hostname}`,
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
      message: `Unable to connect to the Skaarhoj panel at ${this.panelConfiguration.hostname}`,
      statusCode: StatusCode.WARNING,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private createDisconnectedStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Disconnected from Skaarhoj panel',
      message: `The Skaarhoj panel at ${this.panelConfiguration.hostname} was disconnected`,
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
    if (this.reconnectionTimeout) {
      return
    }
    this.statusMessageService.sendStatusMessage(this.createReconnectingStatusMessage())

    this.reconnectionTimeout = setTimeout(() => {
      clearTimeout(this.reconnectionTimeout)
      this.reconnectionTimeout = undefined

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

  public getPanelConfiguration(): PanelConfiguration {
    return this.panelConfiguration
  }

  public updatePanelLayoutConfiguration(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.panelLayoutConfiguration = panelLayoutConfiguration
  }
}
