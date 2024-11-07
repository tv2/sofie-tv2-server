import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'

export interface DeviceEmitter {
  emitVideoMixerConfiguration(videoMixerConfiguration: VideoMixerConfiguration): void
}
