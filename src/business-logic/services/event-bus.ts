import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { PanelEmitter } from '../interfaces/panel-emitter'
import { PanelObserver } from '../interfaces/panel-observer'
import { EventEmitter } from 'node:events'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusMessageEmitter } from '../interfaces/status-message-emitter'
import { StatusMessageObserver } from '../interfaces/status-message-observer'
import { VideoMixerConfiguration } from '../../model/interfaces/video-mixer-configuration'
import { DeviceObserver } from '../interfaces/device-observer'
import { DeviceEmitter } from '../interfaces/device-emitter'
import { RundownEmitter } from '../interfaces/rundown-emitter'
import { RundownObserver } from '../interfaces/rundown-observer'

export class EventBus implements PanelEmitter, PanelObserver, StatusMessageEmitter, StatusMessageObserver, DeviceEmitter, DeviceObserver, RundownEmitter, RundownObserver {
  private readonly eventEmitter: EventEmitter<{
    panelConfigurationCreated: [PanelConfiguration]
    panelConfigurationUpdated: [PanelConfiguration]
    panelConfigurationDeleted: [string]
    panelLayoutConfigurationCreated: [PanelLayoutConfiguration]
    panelLayoutConfigurationUpdated: [PanelLayoutConfiguration]
    panelLayoutConfigurationDeleted: [string]
    statusMessage: [StatusMessage]
    videoMixerConfigurationUpdated: [VideoMixerConfiguration]
    activeRundownId: [string | undefined]
  }> = new EventEmitter()

  public emitPanelLayoutConfigurationCreated(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.eventEmitter.emit('panelLayoutConfigurationCreated', panelLayoutConfiguration)
  }

  public emitPanelLayoutConfigurationUpdated(panelLayoutConfiguration: PanelLayoutConfiguration): void {
    this.eventEmitter.emit('panelLayoutConfigurationUpdated', panelLayoutConfiguration)
  }

  public emitPanelLayoutConfigurationDeleted(panelLayoutConfigurationId: string): void {
    this.eventEmitter.emit('panelLayoutConfigurationDeleted', panelLayoutConfigurationId)
  }

  public emitPanelConfigurationCreated(panelConfiguration: PanelConfiguration): void {
    this.eventEmitter.emit('panelConfigurationCreated', panelConfiguration)
  }

  public emitPanelConfigurationUpdated(panelConfiguration: PanelConfiguration): void {
    this.eventEmitter.emit('panelConfigurationUpdated', panelConfiguration)
  }

  public emitPanelConfigurationDeleted(panelConfigurationId: string): void {
    this.eventEmitter.emit('panelConfigurationDeleted', panelConfigurationId)
  }

  public subscribeToPanelConfigurationCreated(onPanelConfigurationCreatedCallback: (panelConfiguration: PanelConfiguration) => void): void {
    this.eventEmitter.on('panelConfigurationCreated', onPanelConfigurationCreatedCallback)
  }

  public subscribeToPanelConfigurationUpdated(onPanelConfigurationUpdatedCallback: (panelConfiguration: PanelConfiguration) => void): void {
    this.eventEmitter.on('panelConfigurationUpdated', onPanelConfigurationUpdatedCallback)
  }

  public subscribeToPanelConfigurationDeleted(onPanelConfigurationDeletedCallback: (panelConfigurationId: string) => void): void {
    this.eventEmitter.on('panelConfigurationDeleted', onPanelConfigurationDeletedCallback)
  }

  public subscribeToPanelLayoutConfigurationCreated(onPanelLayoutConfigurationCreatedCallback: (panelLayoutConfiguration: PanelLayoutConfiguration) => void): void {
    this.eventEmitter.on('panelLayoutConfigurationCreated', onPanelLayoutConfigurationCreatedCallback)
  }

  public subscribeToPanelLayoutConfigurationUpdated(onPanelLayoutConfigurationUpdatedCallback: (panelLayoutConfiguration: PanelLayoutConfiguration) => void): void {
    this.eventEmitter.on('panelLayoutConfigurationUpdated', onPanelLayoutConfigurationUpdatedCallback)
  }

  public subscribeToPanelLayoutConfigurationDeleted(onPanelLayoutConfigurationDeletedCallback: (panelLayoutConfigurationId: string) => void): void {
    this.eventEmitter.on('panelLayoutConfigurationDeleted', onPanelLayoutConfigurationDeletedCallback)
  }

  public subscribeToStatusMessages(onStatusMessageEventCallback: (statusMessage: StatusMessage) => void): void {
    this.eventEmitter.on('statusMessage', onStatusMessageEventCallback)
  }

  public emitStatusMessage(statusMessage: StatusMessage): void {
    this.eventEmitter.emit('statusMessage', statusMessage)
  }

  public emitVideoMixerConfigurationUpdated(videoMixerConfiguration: VideoMixerConfiguration): void {
    this.eventEmitter.emit('videoMixerConfigurationUpdated', videoMixerConfiguration)
  }

  public subscribeToVideoMixerConfigurationUpdated(onVideoMixerConfigurationsCallback: (videoMixerConfiguration: VideoMixerConfiguration) => void): void {
    this.eventEmitter.on('videoMixerConfigurationUpdated', onVideoMixerConfigurationsCallback)
  }

  public emitActiveRundownId(rundownId: string | undefined): void {
    this.eventEmitter.emit('activeRundownId', rundownId)
  }

  public subscribeToRundownActiveRundownId(onActiveRundownIdChangedCallback: (rundownId: (string | undefined)) => void): void {
    this.eventEmitter.on('activeRundownId', onActiveRundownIdChangedCallback)
  }
}
