import { ErrorCode } from '../enums/error-code'

export abstract class Exception extends Error {
  public readonly errorCode: ErrorCode

  protected constructor(errorCode: ErrorCode, message: string) {
    super(message)
    this.errorCode = errorCode
  }
}
