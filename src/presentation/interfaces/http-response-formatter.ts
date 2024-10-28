import { ErrorCode } from '../../model/enums/error-code'

export interface HttpResponseFormatter {
  formatSuccessResponse(data?: unknown): object
  formatErrorResponse(errorCode: ErrorCode, data: unknown): object
}
