import { RgbColor } from '../interfaces/color-converter'

export enum SkaarhojButtonState {
  OFF = 0,
  ON_AMBER = 1,
  ON_RED = 2,
  ON_GREEN = 3,
  ON = 4,
  DIMMED = 5
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

const DEFAULT_SKAARHOJ_COLOR: number = 128

export class SkaarhojColorCommand extends SkaarhojCommand {
  private readonly idPrefix: string = 'HWCc#'
  private readonly color: RgbColor | undefined

  public constructor(id: string, color: RgbColor | undefined) {
    super(id)
    this.color = color
  }

  public toString(): string {
    if (!this.color) {
      return `${this.idPrefix}${this.id}=${DEFAULT_SKAARHOJ_COLOR}`
    }

    return `{ "HWCIDs": [${this.id}], "HWCColor": { "ColorRGB": { "red": ${this.color.red}, "green": ${this.color.green}, "blue": ${this.color.blue} } }  }`
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

export class SkaarhojClearAllCommand extends SkaarhojCommand {
  public constructor() {
    super('')
  }

  public override toString(): string {
    return 'Clear'
  }
}
