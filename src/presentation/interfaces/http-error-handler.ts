import { FastifyReply } from 'fastify'
import { Exception } from '../../model/exceptions/exception'
import { Logger } from '../../logger/logger'
import { ErrorCode } from '../../model/enums/error-code'
import { HttpStatusCode } from '../enum/http-status-code'

export class HttpErrorHandler {
  private readonly logger: Logger

  public constructor(logger: Logger) {
    this.logger = logger.tag(HttpErrorHandler.name)
  }

  public async handleError(reply: FastifyReply, exception: unknown): Promise<void> {
    if (!(exception instanceof Exception)) {
      this.logger.data(exception).error('Unknown exception type caught')
      await reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(exception)
      return
    }
    this.logger.data(exception).error(`Caught Exception "${exception.errorCode}. Message ${exception.message}`)
    await reply.status(this.mapErrorCodeToHttpStatusCode(exception.errorCode)).send(exception)
  }

  private mapErrorCodeToHttpStatusCode(errorCode: ErrorCode): HttpStatusCode {
    switch (errorCode) {
      case ErrorCode.NOT_FOUND:
        return HttpStatusCode.NOT_FOUND
      case ErrorCode.DATABASE_NOT_CONNECTED:
        return HttpStatusCode.SERVICE_UNAVAILABLE
      default:
        return HttpStatusCode.INTERNAL_SERVER_ERROR
    }
  }
}
