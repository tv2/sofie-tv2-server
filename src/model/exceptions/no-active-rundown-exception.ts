import { Exception } from './exception'
import { ErrorCode } from '../enums/error-code'

export class NoActiveRundownException extends Exception {
  public constructor(message: string) {
    super(ErrorCode.NO_ACTIVE_RUNDOWN, message)
  }
}
