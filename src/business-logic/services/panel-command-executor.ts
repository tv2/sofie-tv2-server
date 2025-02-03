import { ActionPanelCommand, TBarPanelCommand } from '../../model/interfaces/input-configuration'
import { HttpService } from '../interfaces/http-service'
import { Logger } from '../../logger/logger'
import { VideoMixer } from '../panel-integrations/interfaces/video-mixer'
import { Rundown } from '../../model/entities/rundown'

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
    this.httpService.put(`/actions/${command.actionId}/rundowns/${rundown.id}`, { actionArguments: command.actionArguments }).catch((error) => {
      this.logger.data(error).error(`Error executing Action ${command.actionId}`)
    })
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
