import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'

export interface DeviceObserver {
  subscribeToVideoMixerConfigurationUpdated(onVideoMixerConfigurationUpdatedCallback: (videoMixerConfiguration: VideoMixerConfiguration) => void): void
}
