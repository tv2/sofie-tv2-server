import { FastifyReply } from 'fastify'
import { Exception } from '../../model/exceptions/exception'
import { Logger } from '../../logger/logger'
import { ErrorCode } from '../../model/enums/error-code'
import { HttpStatusCode } from '../enums/http-status-code'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'
import { HttpException } from '../../model/exceptions/http-exception'

export class HttpErrorHandler {
  private readonly logger: Logger

  public constructor(private readonly httpResponseFormatter: HttpResponseFormatter, logger: Logger) {
    this.logger = logger.tag(HttpErrorHandler.name)
  }

  public async handleError(reply: FastifyReply, exception: unknown): Promise<void> {
    if (!(exception instanceof Exception)) {
      this.logger.data(exception).error('Unknown exception type caught')
      await reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(this.httpResponseFormatter.formatErrorResponse(ErrorCode.UNKNOWN, exception))
      return
    }
    this.logger.data(exception).error(`Caught Exception "${exception.errorCode}. Message ${exception.message}`)
    await this.sendErrorReply(reply, exception)
  }

  private async sendErrorReply(reply: FastifyReply, exception: Exception): Promise<void> {
    await reply.status(this.mapExceptionToHttpStatusCode(exception)).send(this.httpResponseFormatter.formatErrorResponse(exception.errorCode, exception.message))
  }

  private mapExceptionToHttpStatusCode(exception: Exception): HttpStatusCode {
    if (exception instanceof HttpException) {
      return exception.httpStatusCode
    }
    switch (exception.errorCode) {
      case ErrorCode.NOT_FOUND: {
        return HttpStatusCode.NOT_FOUND
      }
      case ErrorCode.INVALID_ID:
      case ErrorCode.UNSUPPORTED_OPERATION: {
        return HttpStatusCode.BAD_REQUEST
      }
      case ErrorCode.DATABASE_NOT_CONNECTED: {
        return HttpStatusCode.SERVICE_UNAVAILABLE
      }
      default: {
        return HttpStatusCode.INTERNAL_SERVER_ERROR
      }
    }
  }
}
