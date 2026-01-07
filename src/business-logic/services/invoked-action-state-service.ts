import { InvokedActionService } from '../interfaces/invoked-action-service'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { Action } from '../../model/entities/action'
import { ActionObserver } from '../interfaces/action-observer'
import { PlayoutContentObserver } from '../interfaces/playout-content-observer'
import {
  CameraPlayoutContent,
  DownstreamKeyerPlayoutContent,
  PlayoutContent,
  RecalledPlayoutContent,
  RemotePlayoutContent,
  ReplayPlayoutContent,
  SplitScreenInputPlayoutContent,
  SplitScreenPlayoutContent
} from '../../model/value-objects/playout-content'
import { RundownService } from '../interfaces/rundown-service'
import { RundownObserver } from '../interfaces/rundown-observer'
import { PlayoutContentType } from '../../model/enums/playout-content-type'
import { OutputChannel } from '../../model/enums/output-channel'

const ACTION_ENDPOINT: string = '/actions/rundowns/'
const PLAYOUT_CONTENT_ENDPOINT: string = '/rundowns/random-rundown-id/playoutContents'

interface PlayoutContentFetchResponse {
  program: PlayoutContent[]
  preview: PlayoutContent[]
}

export class InvokedActionStateService implements InvokedActionService {
  private static instance: InvokedActionService

  public static getInstance(
    rundownService: RundownService,
    rundownObserver: RundownObserver,
    actionObserver: ActionObserver,
    playoutContentObserver: PlayoutContentObserver,
    httpService: HttpService,
    logger: Logger
  ): InvokedActionService {
    if (!this.instance) {
      this.instance = new InvokedActionStateService(
        rundownService,
        rundownObserver,
        actionObserver,
        playoutContentObserver,
        httpService,
        logger
      )
    }
    return this.instance
  }

  private activeRundownId: string | undefined
  private actions: Action[] = []
  private programPlayoutContents: PlayoutContent[] = []
  private previewPlayoutContents: PlayoutContent[] = []

  private readonly invokedActionIdSubscribers: Map<string, (invokedActionIds: string[]) => void> = new Map()

  private invokedActionIds: string[] = []

  private constructor(
    private readonly rundownService: RundownService,
    private readonly rundownObserver: RundownObserver,
    private readonly actionObserver: ActionObserver,
    private readonly playoutContentObserver: PlayoutContentObserver,
    private readonly httpService: HttpService,
    private readonly logger: Logger
  ) {
    this.listenForActiveRundownId()
    this.fetchCurrentPlayoutContents().catch(error => logger.error(error))
    this.listenForActionUpdates()
    this.listenForPlayoutContentUpdates()
  }

  private listenForActiveRundownId(): void {
    this.rundownService.getActiveRundown().then((activeRundown) => {
      this.activeRundownId = activeRundown?.id
      if (this.activeRundownId) {
        this.fetchActions().catch(error => this.logger.error(error))
      }
    }).catch(error => this.logger.error(error))

    this.rundownObserver.subscribeToActiveRundownId((activeRundownId: string | undefined) => {
      this.activeRundownId = activeRundownId
      this.fetchActions().catch(error => this.logger.error(error))
    })
  }

  private async fetchActions(): Promise<void> {
    if (!this.activeRundownId) {
      return
    }
    this.actions = await this.httpService.get(`${ACTION_ENDPOINT}${this.activeRundownId}`) as Action[]
    this.updateInvokedActionIds()
  }

  private async fetchCurrentPlayoutContents(): Promise<void> {
    const playoutContentResponse: PlayoutContentFetchResponse = await this.httpService.get(PLAYOUT_CONTENT_ENDPOINT) as PlayoutContentFetchResponse
    this.programPlayoutContents = playoutContentResponse.program
    this.previewPlayoutContents = playoutContentResponse.preview
    this.updateInvokedActionIds()
  }

  private listenForActionUpdates(): void {
    this.actionObserver.subscribeToActionsUpdated((actions: Action[], rundownId?: string) => {
      if (this.activeRundownId !== rundownId) {
        // We only care about Actions for the active Rundown.
        return
      }
      this.actions = actions
      this.updateInvokedActionIds()
    })
  }

  private listenForPlayoutContentUpdates(): void {
    this.playoutContentObserver.subscribeToProgramPlayoutContents((playoutContents: PlayoutContent[]) => {
      this.programPlayoutContents = playoutContents
      this.updateInvokedActionIds()
    })

    this.playoutContentObserver.subscribeToPreviewPlayoutContents((playoutContents: PlayoutContent[]) => {
      this.previewPlayoutContents = playoutContents
      this.updateInvokedActionIds()
    })
  }

  public subscribeToInvokedActionIds(subscriberId: string, callback: (invokedActionIds: string[]) => void): void {
    this.invokedActionIdSubscribers.set(subscriberId, callback)
    callback(this.invokedActionIds) // We emit the current invokedActionIds when subscribing, so the caller don't need to wait for the next event.
  }

  public unsubscribeFromInvokedActionIds(subscriberId: string): void {
    this.invokedActionIdSubscribers.delete(subscriberId)
  }

  private updateInvokedActionIds(): void {
    const validPlayoutContentTypes: PlayoutContentType[] = [
      PlayoutContentType.CAMERA,
      PlayoutContentType.REMOTE,
      PlayoutContentType.REPLAY,
      PlayoutContentType.SPLIT_SCREEN,
      PlayoutContentType.SPLIT_SCREEN_INPUT,
      PlayoutContentType.RECALLED,
      PlayoutContentType.DOWNSTREAM_KEYER
    ]
    this.invokedActionIds = this.actions
      .filter(action => validPlayoutContentTypes.includes(action.metadata.playoutContent.type))
      .filter(action => this.isActionInProgramPreviewPlayoutContent(action))
      .map(action => action.id)

    this.emitInvokedActionIds()
  }

  private isActionInProgramPreviewPlayoutContent(action: Action): boolean {
    switch (action.metadata.outputChannel) {
      case OutputChannel.PROGRAM: {
        return this.isActionInvokedInPlayoutContents(action, this.programPlayoutContents)
      }
      case OutputChannel.PREVIEW: {
        return this.isActionInvokedInPlayoutContents(action, this.previewPlayoutContents)
      }
      case OutputChannel.UNKNOWN: {
        return this.isActionInvokedInPlayoutContents(action, this.programPlayoutContents)
          || this.isActionInvokedInPlayoutContents(action, this.previewPlayoutContents)
      }
      default: {
        return false
      }
    }
  }

  private isActionInvokedInPlayoutContents(action: Action, playoutContents: PlayoutContent[]): boolean {
    return playoutContents.some((playoutContent: PlayoutContent) => {
      if (action.metadata.playoutContent.type === PlayoutContentType.SPLIT_SCREEN_INPUT && playoutContent.type === PlayoutContentType.SPLIT_SCREEN) {
        return Object.values(playoutContent.inputPlayoutContents).some(playoutContentSource => this.arePlayoutContentsEqual(playoutContentSource, action.metadata.playoutContent))
      }
      return this.arePlayoutContentsEqual(playoutContent, action.metadata.playoutContent)
    })
  }

  private arePlayoutContentsEqual(playoutContentA: PlayoutContent, playoutContentB: PlayoutContent): boolean {
    if (playoutContentA.type !== playoutContentB.type) {
      return false
    }
    switch (playoutContentB.type) {
      case PlayoutContentType.CAMERA: {
        return playoutContentB.source === (playoutContentA as CameraPlayoutContent).source
      }
      case PlayoutContentType.REMOTE: {
        return playoutContentB.source === (playoutContentA as RemotePlayoutContent).source
      }
      case PlayoutContentType.REPLAY: {
        return playoutContentB.source === (playoutContentA as ReplayPlayoutContent).source
      }
      case PlayoutContentType.SPLIT_SCREEN: {
        return playoutContentB.layout.toLowerCase() === (playoutContentA as SplitScreenPlayoutContent).layout.toLowerCase()
      }
      case PlayoutContentType.SPLIT_SCREEN_INPUT: {
        return this.isSplitScreenInputPlayoutContentsEqual(playoutContentB, playoutContentA as SplitScreenInputPlayoutContent)
      }
      case PlayoutContentType.RECALLED: {
        return playoutContentB.recalledType === (playoutContentA as RecalledPlayoutContent).recalledType
      }
      case PlayoutContentType.DOWNSTREAM_KEYER: {
        const downstreamKeyerPlayoutContentA: DownstreamKeyerPlayoutContent = playoutContentA as DownstreamKeyerPlayoutContent
        return playoutContentB.identifier === downstreamKeyerPlayoutContentA.identifier
          && playoutContentB.isOn === downstreamKeyerPlayoutContentA.isOn
      }
      default: {
        return false
      }
    }
  }

  private isSplitScreenInputPlayoutContentsEqual(splitScreenInputA: SplitScreenInputPlayoutContent, splitScreenInputB: SplitScreenInputPlayoutContent): boolean {
    if (splitScreenInputA.inputIndex !== splitScreenInputB.inputIndex) {
      return false
    }
    return this.arePlayoutContentsEqual(splitScreenInputA.sourcePlayoutContent, splitScreenInputB.sourcePlayoutContent)
  }

  private emitInvokedActionIds(): void {
    this.invokedActionIdSubscribers.forEach((callback: (invokedActionIds: string[]) => void) => callback(this.invokedActionIds))
  }
}
