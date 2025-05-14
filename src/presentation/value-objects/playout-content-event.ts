import { TypedEvent } from './typed-event'
import { PlayoutContentEventType } from '../enums/event-type'
import { PlayoutContent } from '../../model/value-objects/playout-content'

export interface PlayoutContentEvent extends TypedEvent {
  type: PlayoutContentEventType
}

export interface ProgramPlayoutContentEvent extends PlayoutContentEvent {
  type: PlayoutContentEventType.PROGRAM_PLAYOUT_CONTENT
  playoutContents: PlayoutContent[]
}

export interface PreviewPlayoutContentEvent extends PlayoutContentEvent {
  type: PlayoutContentEventType.PREVIEW_PLAYOUT_CONTENT
  playoutContents: PlayoutContent[]
}
