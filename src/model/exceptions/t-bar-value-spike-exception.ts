import { Exception } from './exception'
import { ErrorCode } from '../enums/error-code'

export class TBarValueSpikeException extends Exception {
  public constructor(message: string) {
    super(ErrorCode.T_BAR_VALUE_SPIKE, message)
  }
}
