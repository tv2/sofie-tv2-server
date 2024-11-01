export interface VideoMixer {
  sendTBarCommand(tBarPosition: number): void // The tBarPosition should range from 0 to 1.000
}
