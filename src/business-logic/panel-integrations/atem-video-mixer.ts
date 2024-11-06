import { VideoMixer } from './interfaces/video-mixer'
import { Atem, AtemConnectionStatus } from 'atem-connection'
import { Logger } from '../../logger/logger'
import { StatusMessageService } from '../services/status-message-service'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusCode } from '../../model/enums/status-code'
import { DeviceObserver } from '../interfaces/device-observer'
import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { HttpService } from '../interfaces/http-service'

const RECONNECTION_TIMEOUT_MS: number = 5000

const ATEM_TRANSITION_MULTIPLICATION_FACTOR: number = 10

const VIDEO_MIXER_CONFIGURATION_ENDPOINT: string = '/devices/videoMixers/configurations'

export class AtemVideoMixer implements VideoMixer {
  private readonly logger: Logger

  private readonly atem: Atem = new Atem()
  private videoMixerConfiguration?: VideoMixerConfiguration

  private reconnectTimerIdentifier: NodeJS.Timeout | undefined

  public constructor(
    private readonly statusMessageService: StatusMessageService,
    private readonly httpService: HttpService,
    deviceObserver: DeviceObserver,
    logger: Logger
  ) {
    this.logger = logger.tag(AtemVideoMixer.name)
    deviceObserver.subscribeToVideoMixerConfiguration((videoMixerConfiguration: VideoMixerConfiguration) => {
      this.videoMixerConfiguration = videoMixerConfiguration
      this.connect()
    })
    this.setup()
    this.fetchVideoMixerConfiguration().catch(error => this.logger.data(error).error('Error fetching VideoMixerConfiguration'))
  }

  private setup(): void {
    this.atem.on('info', info => this.logger.data(info).info('Atem info'))
    this.atem.on('error', error => this.logger.data(error).error('Error from Atem'))
    this.atem.on('connected', () => {
      this.logger.debug(`Connected to Atem on ${this.videoMixerConfiguration?.hostname}`)
      this.statusMessageService.sendStatusMessage(this.createConnectedStatusMessage())
    })
    this.atem.on('disconnected', () => this.reconnect())
  }

  private createConnectedStatusMessage(): StatusMessage {
    return {
      id: this.getStatusMessageId(),
      title: 'Connected to Atem',
      message: `Connected directly to Atem on ${this.videoMixerConfiguration?.hostname}. Ready to send T-Bar commands.`,
      statusCode: StatusCode.GOOD,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private getStatusMessageId(): string {
    return 'atem_video_mixer'
  }

  private connect(): void {
    if (!this.videoMixerConfiguration) {
      throw new UnsupportedOperationException('Unable to connect to Atem. No VideoMixerConfiguration found.')
    }
    this.atem.connect(this.videoMixerConfiguration.hostname, this.videoMixerConfiguration.port).catch(error => this.logger.data(error).error('Error while connecting to Atem'))
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
      title: 'Reconnecting to Atem',
      message: `Reconnecting to Atem on ${this.videoMixerConfiguration?.hostname}. Unable to send T-Bar command.`,
      statusCode: StatusCode.UNKNOWN,
      lastUpdatedTimestamp: Date.now()
    }
  }

  private async fetchVideoMixerConfiguration(): Promise<void> {
    this.videoMixerConfiguration = await this.httpService.get(VIDEO_MIXER_CONFIGURATION_ENDPOINT) as VideoMixerConfiguration
    this.connect()
  }

  public sendTBarCommand(tBarPosition: number): void {
    this.atem.setTransitionPosition(tBarPosition * ATEM_TRANSITION_MULTIPLICATION_FACTOR).catch(error => this.logger.data(error).error('Failed to update Transition Position for Atem'))
  }
}
