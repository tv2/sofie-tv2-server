import { ActionPanelCommand, TBarPanelCommand } from '../../model/interfaces/input-configuration'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { VideoMixer } from '../panel-integrations/interfaces/video-mixer'
import { Rundown } from '../../model/entities/rundown'

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

  public constructor(
    private readonly httpService: HttpService,
    private readonly videoMixer: VideoMixer,
    logger: Logger
  ) {
    this.logger = logger.tag(PanelCommandExecutor.name)
  }

  public executeActionCommand(command: ActionPanelCommand, rundown: Rundown): void {
    switch (command.actionId) {
      case PseudoActionId.TAKE: {
        this.executeTake(rundown)
        return
      }
      case PseudoActionId.SET_NEXT_PART: {
        this.httpService.put(`/rundowns/${rundown.id}/setNext/PART_AFTER_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part after next Part')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_PART: {
        this.httpService.put(`/rundowns/${rundown.id}/setNext/PART_BEFORE_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part before next Part')
        })
        return
      }
      case PseudoActionId.SET_NEXT_SEGMENT: {
        this.httpService.put(`/rundowns/${rundown.id}/setNext/SEGMENT_AFTER_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment after next Segment')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_SEGMENT: {
        this.httpService.put(`/rundowns/${rundown.id}/setNext/SEGMENT_BEFORE_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment before next Segment')
        })
        return
      }
      default: {
        this.httpService.put(`/actions/${command.actionId}/rundowns/${rundown.id}`, { actionArguments: command.actionArguments }).catch((error) => {
          this.logger.data(error).error(`Error executing Action ${command.actionId}`)
        })
      }
    }
  }

  private executeTake(rundown: Rundown): void {
    this.httpService.put(`/rundowns/${rundown.id}/takeNext`).catch((error) => {
      this.logger.data(error).error('Error executing TAKE')
    })
  }

  public executeTBarCommand(command: TBarPanelCommand, rundown: Rundown): void {
    if (!command.value) {
      return
    }
    this.videoMixer.setTransitionPosition(command.value)
    if (command.shouldExecuteTake) {
      this.executeTake(rundown)
    }
  }
}
