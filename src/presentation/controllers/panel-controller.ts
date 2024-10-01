import { BaseController, GetRequest, PostRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PhysicalPanelLayoutRepository } from '../../data-access/physical-panel-layout-repository'
import { PhysicalPanelLayout } from '../../model/interfaces/physical-panel-layout'
import { JSONSchema7 } from 'json-schema'

// TODO: This is for demonstration purposes. DELETE IT!
const PANEL_LAYOUT_CONFIGURATION_SCHEMA: JSONSchema7 = {
  type: 'object',
  properties: {
    hello: {
      type: 'string',
    },
  },
  required: ['hello'],
}

@RestController('/panels')
export class PanelController extends BaseController {
  public constructor(private readonly physicalPanelLayoutRepository: PhysicalPanelLayoutRepository) {
    super()
  }

  @GetRequest('/physicalPanelLayouts')
  public async getPhysicalPanelLayouts(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const physicalPanelLayouts: PhysicalPanelLayout[] = this.physicalPanelLayoutRepository.getPhysicalPanelLayouts()
    await reply.code(200).send(physicalPanelLayouts)
  }

  @PostRequest('/panelLayoutConfigurations', PANEL_LAYOUT_CONFIGURATION_SCHEMA)
  public async createPanelLayoutConfiguration(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await reply.code(200).send(request.body)
  }
}
