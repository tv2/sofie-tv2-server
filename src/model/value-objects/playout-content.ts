import { PlayoutContentType } from '../enums/playout-content-type'

export type PlayoutContent =
  | SourcePlayoutContent
  | SplitScreenPlayoutContent
  | SplitScreenInputPlayoutContent
  | GraphicsPlayoutContent
  | OverlayGraphicsPlayoutContent
  | VideoPlayoutContent
  | VoiceOverPlayoutContent
  | JinglePlayoutContent
  | AudioPlayoutContent
  | ManusPlayoutContent
  | TransitionPlayoutContent
  | CommandPlayoutContent
  | RecalledPlayoutContent
  | DownstreamKeyerPlayoutContent
  | UnknownPlayoutContent

export type SourcePlayoutContent = CameraPlayoutContent | RemotePlayoutContent | ReplayPlayoutContent | UnknownPlayoutContent

export interface CameraPlayoutContent {
  readonly type: PlayoutContentType.CAMERA
  readonly source: string
}

export interface RemotePlayoutContent {
  readonly type: PlayoutContentType.REMOTE
  readonly source: string
}

export interface ReplayPlayoutContent {
  readonly type: PlayoutContentType.REPLAY
  readonly source: string
}

export interface SplitScreenPlayoutContent {
  readonly type: PlayoutContentType.SPLIT_SCREEN
  readonly layout: string
  readonly inputPlayoutContents: Readonly<Record<number, SourcePlayoutContent>>
}

export interface SplitScreenInputPlayoutContent {
  readonly type: PlayoutContentType.SPLIT_SCREEN_INPUT
  readonly inputIndex: number // zero-indexed
  readonly sourcePlayoutContent: SourcePlayoutContent
}

interface GraphicsPlayoutContent {
  readonly type: PlayoutContentType.GRAPHICS
}

interface OverlayGraphicsPlayoutContent {
  readonly type: PlayoutContentType.OVERLAY_GRAPHICS
}

interface VideoPlayoutContent {
  readonly type: PlayoutContentType.VIDEO_CLIP
}

interface VoiceOverPlayoutContent {
  readonly type: PlayoutContentType.VOICE_OVER
}

interface JinglePlayoutContent {
  readonly type: PlayoutContentType.JINGLE
}

interface AudioPlayoutContent {
  readonly type: PlayoutContentType.AUDIO
}

interface ManusPlayoutContent {
  readonly type: PlayoutContentType.MANUS
}

interface TransitionPlayoutContent {
  readonly type: PlayoutContentType.TRANSITION
}

interface CommandPlayoutContent {
  readonly type: PlayoutContentType.COMMAND
}

export interface RecalledPlayoutContent {
  readonly type: PlayoutContentType.RECALLED
  readonly recalledType: PlayoutContentType
}

export interface DownstreamKeyerPlayoutContent {
  readonly type: PlayoutContentType.DOWNSTREAM_KEYER
  readonly identifier: string
  readonly isOn: boolean
}

interface UnknownPlayoutContent {
  readonly type: PlayoutContentType.UNKNOWN
}
