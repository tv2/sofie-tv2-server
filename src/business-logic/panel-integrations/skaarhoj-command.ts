import { Color } from '../../model/enums/color'

export enum SkaarhojButtonState {
  OFF = 0,
  ON_AMBER = 1,
  ON_RED = 2,
  ON_GREEN = 3,
  ON = 4
}

enum SkaarhojColor {
  DEFAULT = '128',
  BLACK = '129',
  WHITE = '130',
  WARM = '131',
  RED = '132',
  ROSE = '133',
  PINK = '134',
  PURPLE = '135',
  AMBER = '136',
  YELLOW = '137',
  DARK_BLUE = '138',
  BLUE = '139',
  CYAN = '141',
  GREEN = '196'
}

export abstract class SkaarhojCommand {
  protected constructor(protected id: string) {}

  public abstract toString(): string
}

export class SkaarhojStateCommand extends SkaarhojCommand {
  private readonly idPrefix: string = 'HWC#'

  public constructor(id: string, private readonly state: SkaarhojButtonState) {
    super(id)
  }

  public toString(): string {
    return `${this.idPrefix}${this.id}=${this.state}`
  }
}

export class SkaarhojColorCommand extends SkaarhojCommand {
  private readonly idPrefix: string = 'HWCc#'
  private readonly color: SkaarhojColor

  public constructor(id: string, color: Color) {
    super(id)
    this.color = this.mapColorToSkaarhojColor(color)
  }

  private mapColorToSkaarhojColor(color: Color): SkaarhojColor {
    switch (color) {
      case Color.RED: return SkaarhojColor.RED
      case Color.PINK: return SkaarhojColor.PINK
      case Color.GREEN: return SkaarhojColor.GREEN
      case Color.BLUE: return SkaarhojColor.BLUE
      case Color.DARK_BLUE: return SkaarhojColor.DARK_BLUE
      case Color.PURPLE: return SkaarhojColor.PURPLE
      default: return SkaarhojColor.DEFAULT
    }
  }

  public toString(): string {
    return `${this.idPrefix}${this.id}=${this.color}`
  }
}

export class SkaarhojTextCommand extends SkaarhojCommand {
  private readonly idPrefix: string = 'HWCt#'
  private title: string = ''
  private textLineOne: string = ''
  private textLineTwo: string = ''
  private format: number = 1

  public constructor(id: string, text: string) {
    super(id)
    this.textLineOne = text
  }

  public setTitle(title: string): SkaarhojTextCommand {
    this.title = title
    return this
  }

  public setTextLineOne(text: string): SkaarhojTextCommand {
    this.textLineOne = text
    return this
  }

  public setTextLineTwo(text: string): SkaarhojTextCommand {
    this.textLineTwo = text
    return this
  }

  public setFormat(format: number): SkaarhojTextCommand {
    this.format = format
    return this
  }

  public toString(): string {
    return `${this.idPrefix}${this.id}=|||${this.title}|${this.format}|${this.textLineOne}|${this.textLineTwo}`
  }
}
