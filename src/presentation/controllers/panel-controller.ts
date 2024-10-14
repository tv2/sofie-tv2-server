import { BaseController, DeleteRequest, GetRequest, PostRequest, PutRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PhysicalPanelLayoutRepository } from '../../data-access/physical-panel-layout-repository'
import { PhysicalPanelLayout } from '../../model/interfaces/physical-panel-layout'
import {
  PanelLayoutConfiguration,
  ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA,
  ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID,
} from '../../model/interfaces/panel-layout-configuration'
import { PanelService } from '../../business-logic/services/interfaces/panel-service'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'
import { HttpErrorHandler } from '../interfaces/http-error-handler'
import { Exception } from '../../model/exceptions/exception'
import { HttpStatusCode } from '../enum/http-status-code'
import {
  PanelConfiguration,
  ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID
} from '../../model/interfaces/panel-configuration'

@RestController('/panels')
export class PanelController extends BaseController {
  public constructor(
    private readonly physicalPanelLayoutRepository: PhysicalPanelLayoutRepository,
    private readonly panelService: PanelService,
    private readonly httpErrorHandler: HttpErrorHandler
  ) {
    super()
  }

  @GetRequest('/physicalPanelLayouts')
  public async getPhysicalPanelLayouts(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const physicalPanelLayouts: PhysicalPanelLayout[] = this.physicalPanelLayoutRepository.getPhysicalPanelLayouts()
      await reply.code(HttpStatusCode.OK).send(physicalPanelLayouts)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @GetRequest('/panelLayoutConfigurations/:id')
  public async getPanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = await this.panelService.getPanelLayoutConfiguration(request.params.id)
      await reply.code(HttpStatusCode.OK).send(new PanelLayoutConfigurationDto(panelLayoutConfiguration))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @GetRequest('/panelLayoutConfigurations')
  public async getPanelLayoutConfigurations(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfigurations: PanelLayoutConfiguration[] = await this.panelService.getPanelLayoutConfigurations()
      await reply.code(HttpStatusCode.OK).send(panelLayoutConfigurations.map(panelLayoutConfiguration => new PanelLayoutConfigurationDto(panelLayoutConfiguration)))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @PostRequest('/panelLayoutConfigurations', ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID)
  public async createPanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelService.createPanelLayoutConfiguration(panelLayoutConfiguration)
      await reply.code(HttpStatusCode.OK).send('Successfully create PanelLayoutConfiguration')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @PutRequest('/panelLayoutConfigurations', ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA)
  public async updatePanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelService.updatePanelLayoutConfiguration(panelLayoutConfiguration)
      await reply.code(HttpStatusCode.OK).send(`Successfully updated PanelLayoutConfiguration for ${panelLayoutConfiguration.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @DeleteRequest('/panelLayoutConfigurations/:id')
  public async deletePanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      await this.panelService.deletePanelLayoutConfiguration(request.params.id)
      await reply.code(HttpStatusCode.OK).send(`Successfully deleted PanelLayoutConfiguration for ${request.params.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }

  @PostRequest('/panelConfigurations', ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID)
  public async createPanelConfiguration(request: FastifyRequest<{ Body: PanelConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelConfiguration: PanelConfiguration = request.body
      await this.panelService.createPanelConfiguration(panelConfiguration)
      await reply.code(HttpStatusCode.OK).send('Successfully created PanelConfiguration')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error as Exception)
    }
  }
}
