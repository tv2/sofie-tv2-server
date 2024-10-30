import { HttpResponseFormatter } from '../interfaces/http-response-formatter'
import { ErrorCode } from '../../model/enums/error-code'
import { RequestStatus } from '../../business-logic/enums/request-status'

export class JsendHttpResponseFormatter implements HttpResponseFormatter {
  public formatSuccessResponse(data?: unknown): object {
    return {
      status: RequestStatus.SUCCESS,
      data
    }
  }

  public formatErrorResponse(errorCode: ErrorCode, data: unknown): object {
    return {
      status: RequestStatus.ERROR,
      code: errorCode,
      message: data
    }
  }
}
