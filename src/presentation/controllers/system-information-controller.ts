import { BaseController, GetRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpStatusCode } from '../enum/http-status-code'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'
import { StatusMessage } from '../../model/entities/status-message'
import { StatusMessageService } from '../../business-logic/status-message-service'

@RestController('/systemInformation')
export class SystemInformationController extends BaseController {
  public constructor(private readonly statusMessageService: StatusMessageService, private readonly httpResponseFormatter: HttpResponseFormatter) {
    super()
  }

  @GetRequest('/statusMessages')
  public async getStatusMessages(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const statusMessages: StatusMessage[] = this.statusMessageService.getStatusMessages()
    await reply.status(HttpStatusCode.OK).send(this.httpResponseFormatter.formatSuccessResponse(statusMessages))
  }
}
