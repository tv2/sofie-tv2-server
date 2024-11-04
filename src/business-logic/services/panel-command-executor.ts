import { ActionPanelCommand, TBarPanelCommand } from '../../model/interfaces/input-configuration'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { VideoMixer } from '../panel-integrations/interfaces/video-mixer'
import { RundownObserver } from '../interfaces/rundown-observer'
import { NoActiveRundownException } from '../../model/exceptions/no-active-rundown-exception'
import { Rundown, RundownMode } from '../../model/entities/rundown'

const BASIC_RUNDOWN_ENDPOINT: string = '/rundowns/basic'

enum PseudoActionId {
  TAKE = 'TAKE',
  SET_NEXT_PART = 'SET_NEXT_PART',
  SET_PREVIOUS_PART = 'SET_PREVIOUS_PART',
  SET_NEXT_SEGMENT = 'SET_NEXT_SEGMENT',
  SET_PREVIOUS_SEGMENT = 'SET_PREVIOUS_SEGMENT'
  // TODO: Add missing "pseudo" Actions as needed
}

export class PanelCommandExecutor {
  private readonly logger: Logger

  private activeRundownId: string | undefined

  public constructor(
    private readonly rundownObserver: RundownObserver,
    private readonly httpService: HttpService,
    private readonly videoMixer: VideoMixer,
    logger: Logger
  ) {
    this.logger = logger.tag(PanelCommandExecutor.name)
    this.rundownObserver.subscribeToRundownActiveRundownId(rundownId => this.activeRundownId = rundownId)
    this.fetchActiveRundown().catch(error => this.logger.data(error).error('Failed to fetch active Rundown'))
  }

  private async fetchActiveRundown(): Promise<void> {
    const rundowns: Rundown[] = await this.httpService.get(BASIC_RUNDOWN_ENDPOINT) as Rundown[]
    const activeRundown: Rundown | undefined = rundowns.find(rundown => rundown.mode === RundownMode.ACTIVE || rundown.mode === RundownMode.REHEARSAL)
    this.activeRundownId = activeRundown?.id
  }

  public executeActionCommand(command: ActionPanelCommand): void {
    this.assertActiveRundown()

    switch (command.actionId) {
      case PseudoActionId.TAKE: {
        this.executeTake()
        return
      }
      case PseudoActionId.SET_NEXT_PART: {
        this.httpService.put(`/rundowns/${this.activeRundownId}/setNext/PART_AFTER_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part after next Part')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_PART: {
        this.httpService.put(`/rundowns/${this.activeRundownId}/setNext/PART_BEFORE_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part before next Part')
        })
        return
      }
      case PseudoActionId.SET_NEXT_SEGMENT: {
        this.httpService.put(`/rundowns/${this.activeRundownId}/setNext/SEGMENT_AFTER_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment after next Segment')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_SEGMENT: {
        this.httpService.put(`/rundowns/${this.activeRundownId}/setNext/SEGMENT_BEFORE_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment before next Segment')
        })
        return
      }
      default: {
        this.httpService.put(`/actions/${command.actionId}/rundowns/${this.activeRundownId}`, { actionArguments: command.actionArguments }).catch((error) => {
          this.logger.data(error).error(`Error executing Action ${command.actionId}`)
        })
      }
    }
  }

  private assertActiveRundown(): void {
    if (!this.activeRundownId) {
      throw new NoActiveRundownException('Unable to execute command since there is no active Rundown')
    }
  }

  private executeTake(): void {
    this.httpService.put(`/rundowns/${this.activeRundownId}/takeNext`).catch((error) => {
      this.logger.data(error).error('Error executing TAKE')
    })
  }

  public executeTBarCommand(command: TBarPanelCommand): void {
    this.assertActiveRundown()

    if (!command.value) {
      return
    }
    this.videoMixer.sendTBarCommand(command.value)
    if (command.shouldExecuteTake) {
      this.executeTake()
    }
  }
}
