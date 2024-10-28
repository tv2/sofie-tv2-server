import { Panel } from '../services/interfaces/panel'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelType, SkaarhojModel } from '../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import net, { Socket } from 'node:net'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusCode } from '../../model/enums/status-code'

const SKAARHOJ_PORT: number = 9923

export class SkaarhojPanel implements Panel {
  private readonly logger: Logger
  private socket: Socket = new Socket()

  public constructor(
    private readonly panelConfiguration: PanelConfiguration,
    private readonly statusMessageService: StatusMessageService,
    logger: Logger
  ) {
    this.logger = logger.tag(`${SkaarhojPanel.name}:${panelConfiguration.hostname}`)
    this.assertValidPanelConfiguration(panelConfiguration)
    this.connectToSocket()
  }

  private assertValidPanelConfiguration(panelConfiguration: PanelConfiguration): void {
    if (panelConfiguration.type !== PanelType.SKAARHOJ) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.type}`)
    }
    if (!Object.values(SkaarhojModel).includes(panelConfiguration.model)) {
      throw new UnsupportedOperationException(`Can't create a Skaarhoj Panel for a ${panelConfiguration.model}`)
    }
  }

  private connectToSocket(): void {
    this.socket = net.createConnection(SKAARHOJ_PORT, this.panelConfiguration.hostname, () => {
      this.logger.info(`Connected to Skaarhoj Panel on ${this.panelConfiguration.hostname}:${SKAARHOJ_PORT}`)
      this.socket.write('list\n')
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
}
