import { ColorConverter, RgbColor } from '../interfaces/color-converter'

const HEX_CHARACTERS = 'a-f\\d'
const MATCH_3_OR_4_HEX = `#?[${HEX_CHARACTERS}]{3}[${HEX_CHARACTERS}]?`
const MATCH_6_OR_8_HEX = `#?[${HEX_CHARACTERS}]{6}([${HEX_CHARACTERS}]{2})?`
const NON_HEX_CHARS = new RegExp(`[^#${HEX_CHARACTERS}]`, 'gi')
const VALID_HEX_SIZE = new RegExp(`^${MATCH_3_OR_4_HEX}$|^${MATCH_6_OR_8_HEX}$`, 'i')

/**
 * This ColorConverter is a direct implementation of the hex-rgb library, found at: https://github.com/sindresorhus/hex-rgb
 */
export class HexRgbColorConverter implements ColorConverter {
  public hexToRgb(hex: string): RgbColor | undefined {
    if (NON_HEX_CHARS.test(hex) || !VALID_HEX_SIZE.test(hex)) {
      return
    }

    hex = hex.replace(/^#/, '')

    if (hex.length === 8) {
      hex = hex.slice(0, 6)
    }

    if (hex.length === 4) {
      hex = hex.slice(0, 3)
    }

    if (hex.length === 3) {
      hex = hex[0]! + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    const number: number = Number.parseInt(hex, 16)
    const red: number = number >> 16
    const green: number = number >> 8 & 255
    const blue: number = number & 255

    return { red, green, blue }
  }
}
