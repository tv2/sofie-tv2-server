import { HttpResponseFormatter } from '../interfaces/http-response-formatter'
import { ErrorCode } from '../../model/enums/error-code'

enum RequestStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  ERROR = 'ERROR'
}

export class JsendHttpResponseFormatter implements HttpResponseFormatter {
  public formatSuccessResponse(data?: unknown): object {
    return {
      status: RequestStatus.SUCCESS,
      data
    }
  }

  public formatFailResponse(data?: unknown): object {
    return {
      status: RequestStatus.FAIL,
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
