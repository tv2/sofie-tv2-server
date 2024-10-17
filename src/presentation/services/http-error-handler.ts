import { FastifyReply } from 'fastify'
import { Exception } from '../../model/exceptions/exception'
import { Logger } from '../../logger/logger'
import { ErrorCode } from '../../model/enums/error-code'
import { HttpStatusCode } from '../enum/http-status-code'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'

export class HttpErrorHandler {
  private readonly logger: Logger

  public constructor(private readonly httpResponseFormatter: HttpResponseFormatter, logger: Logger) {
    this.logger = logger.tag(HttpErrorHandler.name)
  }

  public async handleError(reply: FastifyReply, exception: unknown): Promise<void> {
    if (!(exception instanceof Exception)) {
      this.logger.data(exception).error('Unknown exception type caught')
      await this.sendErrorReply(reply, ErrorCode.UNKNOWN, exception)
      return
    }
    this.logger.data(exception).error(`Caught Exception "${exception.errorCode}. Message ${exception.message}`)
    await this.sendErrorReply(reply, exception.errorCode, exception.message)
  }

  private mapErrorCodeToHttpStatusCode(errorCode: ErrorCode): HttpStatusCode {
    switch (errorCode) {
      case ErrorCode.NOT_FOUND:
        return HttpStatusCode.NOT_FOUND
      case ErrorCode.DATABASE_NOT_CONNECTED:
        return HttpStatusCode.SERVICE_UNAVAILABLE
      case ErrorCode.UNSUPPORTED_OPERATION:
        return HttpStatusCode.BAD_REQUEST
      default:
        return HttpStatusCode.INTERNAL_SERVER_ERROR
    }
  }

  private async sendErrorReply(reply: FastifyReply, errorCode: ErrorCode, data: unknown): Promise<void> {
    await reply.status(this.mapErrorCodeToHttpStatusCode(errorCode)).send(this.httpResponseFormatter.formatErrorResponse(errorCode, data))
  }
}
