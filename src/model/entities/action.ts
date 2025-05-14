import { PlayoutContent } from '../value-objects/playout-content'
import { OutputChannel } from '../enums/output-channel'

export interface Action {
  id: string
  metadata: {
    playoutContent: PlayoutContent
    outputChannel: OutputChannel
  }
}
