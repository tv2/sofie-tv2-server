import { BaseController, GetRequest, PostRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PhysicalPanelLayoutRepository } from '../../data-access/physical-panel-layout-repository'
import { PhysicalPanelLayout } from '../../model/interfaces/physical-panel-layout'
import {
  PANEL_LAYOUT_CONFIGURATION_SCHEMA,
  PanelLayoutConfiguration,
} from '../../model/interfaces/panel-layout-configuration'

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
  public async createPanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    const body: PanelLayoutConfiguration = request.body
    await reply.code(200).send(body)
  }
}
