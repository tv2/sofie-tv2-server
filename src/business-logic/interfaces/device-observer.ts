import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'

export interface DeviceObserver {
  subscribeToVideoMixerConfiguration(onVideoMixerConfigurationUpdatedCallback: (videoMixerConfiguration: VideoMixerConfiguration) => void): void
}
