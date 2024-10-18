import { Panel } from '../interfaces/panel'
import { PanelConfiguration } from '../../../model/interfaces/panel-configuration'
import { PanelType, SkaarhojModel } from '../../../model/enums/panel-enums'
import { UnsupportedOperationException } from '../../../model/exceptions/unsupported-operation-exception'
import net, { Socket } from 'node:net'
import { Logger } from '../../../logger/logger'

const SKAARHOJ_PORT: number = 9923

export class SkaarhojPanel implements Panel {
  private readonly logger: Logger
  private socket: Socket = new Socket()

  public constructor(private readonly panelConfiguration: PanelConfiguration, logger: Logger) {
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
    })

    this.socket.on('error', (error) => {
      this.logger.data(error).error(`Error from ${SkaarhojPanel.name}:${this.panelConfiguration.hostname}`)
    })

    this.socket.setEncoding('utf8')
    this.socket.on('data', (data) => {
      this.logger.data(data).info(`Received input from ${SkaarhojPanel.name}:${this.panelConfiguration.hostname}`)
    })
  }
}
