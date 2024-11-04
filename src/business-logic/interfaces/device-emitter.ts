import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'

export interface DeviceEmitter {
  emitVideoMixerConfigurationUpdated(videoMixerConfiguration: VideoMixerConfiguration): void
}
