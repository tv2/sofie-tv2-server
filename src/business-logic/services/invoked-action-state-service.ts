import { InvokedActionService } from '../interfaces/invoked-action-service'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { Action } from '../../model/entities/action'
import { ActionObserver } from '../interfaces/action-observer'
import { PlayoutContentObserver } from '../interfaces/playout-content-observer'
import { PlayoutContent } from '../../model/value-objects/playout-content'

const SYSTEM_ACTIONS_ID: string = 'SYSTEM_ACTIONS_ID'
const ACTION_ENDPOINT: string = '/actions'
const PLAYOUT_CONTENT_ENDPOINT: string = '/rundowns/random-rundown-id/playoutContents'

interface PlayoutContentFetchResponse {
  program: PlayoutContent[]
  preview: PlayoutContent[]
}

export class InvokedActionStateService implements InvokedActionService {
  private static instance: InvokedActionService

  public static getInstance(
    actionObserver: ActionObserver,
    playoutContentObserver: PlayoutContentObserver,
    httpService: HttpService,
    logger: Logger
  ): InvokedActionService {
    if (!this.instance) {
      this.instance = new InvokedActionStateService(actionObserver, playoutContentObserver, httpService, logger)
    }
    return this.instance
  }

  private readonly invokedActionsMap: Map<string, Action[]> = new Map()

  private constructor(
    private readonly actionObserver: ActionObserver,
    private readonly playoutContentObserver: PlayoutContentObserver,
    private readonly httpService: HttpService,
    logger: Logger
  ) {
    this.fetchSystemActions().catch(error => logger.error(error))
    this.fetchCurrentPlayoutContents().catch(error => logger.error(error))
    this.actionObserver.subscribeToActionsUpdated((actions: Action[], rundownId?: string) => {
      this.invokedActionsMap.set(rundownId ?? SYSTEM_ACTIONS_ID, actions)
    })

    this.playoutContentObserver.subscribeToProgramPlayoutContents((playoutContents: PlayoutContent[]) => {
      console.log('### PROGRAM ###')
      console.log(playoutContents)
    })

    this.playoutContentObserver.subscribeToPreviewPlayoutContents((playoutContents: PlayoutContent[]) => {
      console.log('### PREVIEW ###')
      console.log(playoutContents)
    })
  }

  private async fetchSystemActions(): Promise<void> {
    const systemActions: Action[] = await this.httpService.get(ACTION_ENDPOINT) as Action[]
    this.invokedActionsMap.set(SYSTEM_ACTIONS_ID, systemActions)
  }

  private async fetchActionsForRundown(rundownId: string): Promise<void> {
    const actionsForRundown: Action[] = await this.httpService.get(`${ACTION_ENDPOINT}/rundowns/${rundownId}`) as Action[]
    this.invokedActionsMap.set(rundownId, actionsForRundown)
  }

  private async fetchCurrentPlayoutContents(): Promise<void> {
    const playoutContents: PlayoutContentFetchResponse = await this.httpService.get(PLAYOUT_CONTENT_ENDPOINT) as PlayoutContentFetchResponse
    console.log(playoutContents)
    console.log('##########################################')
  }

  public subscribeToInvokedActionIds(): void {
    throw new Error('Method not implemented.')
  }
}
