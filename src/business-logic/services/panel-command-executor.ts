import { ActionPanelCommand, TBarPanelCommand } from '../../model/interfaces/input-configuration'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'

// TODO: Refactor to follow active Rundown in SOF-2268
const RUNDOWN_ID: string = 'jSXbtcsHTPjebGXurMzP401Z3u0_'

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

  public constructor(private readonly httpService: HttpService, logger: Logger) {
    this.logger = logger.tag(PanelCommandExecutor.name)
  }

  public executeActionCommand(command: ActionPanelCommand): void {
    switch (command.actionId) {
      case PseudoActionId.TAKE: {
        this.httpService.put(`/rundowns/${RUNDOWN_ID}/takeNext`).catch((error) => {
          this.logger.data(error).error('Error executing TAKE')
        })
        return
      }
      case PseudoActionId.SET_NEXT_PART: {
        this.httpService.put(`/rundowns/${RUNDOWN_ID}/setNext/PART_AFTER_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part after next Part')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_PART: {
        this.httpService.put(`/rundowns/${RUNDOWN_ID}/setNext/PART_BEFORE_NEXT_PART`).catch((error) => {
          this.logger.data(error).error('Error executing Part before next Part')
        })
        return
      }
      case PseudoActionId.SET_NEXT_SEGMENT: {
        this.httpService.put(`/rundowns/${RUNDOWN_ID}/setNext/SEGMENT_AFTER_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment after next Segment')
        })
        return
      }
      case PseudoActionId.SET_PREVIOUS_SEGMENT: {
        this.httpService.put(`/rundowns/${RUNDOWN_ID}/setNext/SEGMENT_BEFORE_NEXT_SEGMENT`).catch((error) => {
          this.logger.data(error).error('Error executing Segment before next Segment')
        })
        return
      }
      default: {
        this.httpService.put(`/actions/${command.actionId}/rundowns/${RUNDOWN_ID}`, { actionArguments: command.actionArguments }).catch((error) => {
          this.logger.data(error).error(`Error executing Action ${command.actionId}`)
        })
      }
    }
  }

  public executeTBarCommand(_command: TBarPanelCommand): void {
    // TODO: To be implemented in SOF-2264
    throw new UnsupportedOperationException('Not implemented yet')
  }
}
