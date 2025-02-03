import { Exception } from './exception'
import { ErrorCode } from '../enums/error-code'

export class HttpException extends Exception {
  public constructor(public readonly httpStatusCode: number, message: string) {
    super(ErrorCode.UNKNOWN, message)
  }
}
