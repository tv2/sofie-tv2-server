import { PlayoutContent } from '../../model/value-objects/playout-content'

export interface PlayoutContentObserver {
  subscribeToProgramPlayoutContents(onProgramPlayoutContent: (playoutContents: PlayoutContent[]) => void): void
  subscribeToPreviewPlayoutContents(onPreviewPlayoutContent: (playoutContents: PlayoutContent[]) => void): void
}
