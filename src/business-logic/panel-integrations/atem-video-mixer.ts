import { VideoMixer } from './interfaces/video-mixer'
import { Atem, AtemConnectionStatus } from 'atem-connection'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusCode } from '../../model/enums/status-code'

// TODO: Don't hardcode. Fetch from AlbaServer
const ATEM_IP: string = '10.6.26.26' // Atem in Zero
const ATEM_PORT: number = 9910

const RECONNECTION_TIMEOUT_MS: number = 5000

const ATEM_TRANSITION_MULTIPLICATION_FACTOR: number = 10

export class AtemVideoMixer implements VideoMixer {
  private readonly logger: Logger

  private readonly atem: Atem = new Atem()

  private reconnectTimerIdentifier: NodeJS.Timeout | undefined

  public constructor(private readonly statusMessageService: StatusMessageService, logger: Logger) {
    this.logger = logger.tag(AtemVideoMixer.name)
    this.setup()
    this.connect()
  }

  private setup(): void {
    this.atem.on('info', info => this.logger.data(info).info('Atem info'))
    this.atem.on('error', error => this.logger.data(error).error('Error from Atem'))
    this.atem.on('connected', () => {
      this.logger.debug(`Connected to Atem on ${ATEM_IP}`)
      this.statusMessageService.sendStatusMessage(this.createConnectedStatusMessage())
    })
    this.atem.on('disconnected', () => this.reconnect())
  }

  private createConnectedStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Atem is ready for T-bar transitions',
      message: `Connection established to Atem on ${ATEM_IP}. Ready to send T-Bar commands.`,
      statusCode: StatusCode.GOOD,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private getStatusMessageId(): string {
    return 'atem_video_mixer'
  }

  private connect(): void {
    this.atem.connect(ATEM_IP, ATEM_PORT).catch(error => this.logger.data(error).error('Error while connecting to Atem'))
  }

  private reconnect(): void {
    if (this.reconnectTimerIdentifier) {
      return
    }
    this.statusMessageService.sendStatusMessage(this.createReconnectStatusMessage())

    this.reconnectTimerIdentifier = setTimeout(() => {
      clearTimeout(this.reconnectTimerIdentifier)
      this.reconnectTimerIdentifier = undefined

      if (this.atem?.status !== AtemConnectionStatus.CLOSED) {
        return
      }

      this.connect()
    }, RECONNECTION_TIMEOUT_MS)
  }

  private createReconnectStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Unable to send T-bar transitions to Atem',
      message: `Reconnecting to Atem on ${ATEM_IP}. Unable to send T-Bar command.`,
      statusCode: StatusCode.UNKNOWN,
      lastUpdatedTimestamp: Date.now()
    }
  }

  public setTransitionPosition(tBarPosition: number): void {
    this.atem.setTransitionPosition(tBarPosition * ATEM_TRANSITION_MULTIPLICATION_FACTOR).catch(error => this.logger.data(error).error('Failed to update Transition Position for Atem'))
  }
}
