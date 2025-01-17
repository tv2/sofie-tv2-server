export interface RgbColor {
  red: number
  green: number
  blue: number
}

export interface ColorConverter {
  hexToRgb(hex: string): RgbColor | undefined
}
