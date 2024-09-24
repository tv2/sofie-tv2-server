import { BaseController, GetRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'

@RestController('/panels')
export class PanelController extends BaseController {
  @GetRequest('/physicalPanelLayouts')
  public async getPhysicalPanelLayouts(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await reply.code(200).send('Hello world')
  }
}
