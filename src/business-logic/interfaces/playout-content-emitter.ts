import { PlayoutContent } from '../../model/value-objects/playout-content'

export interface PlayoutContentEmitter {
  emitProgramPlayoutContents(playoutContents: PlayoutContent[]): void
  emitPreviewPlayoutContents(playoutContents: PlayoutContent[]): void
}
