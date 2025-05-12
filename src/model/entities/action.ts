import { PlayoutContent } from '../value-objects/playout-content'

export interface Action {
  id: string
  metadata: {
    playoutContent: PlayoutContent
  }
}
