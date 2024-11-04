import { TypedEvent } from './typed-event'
import { DeviceEventType } from '../enums/event-type'

export interface DeviceEvent extends TypedEvent {
  type: DeviceEventType
}

export interface VideoMixerConfigurationUpdatedEvent extends DeviceEvent {
  type: DeviceEventType.VIDEO_MIXER_CONFIGURATION_UPDATED
  videoMixer: {
    hostname: string
    port: number
  }
}
