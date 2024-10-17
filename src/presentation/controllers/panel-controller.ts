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
import { HttpErrorHandler } from '../services/http-error-handler'
import { HttpStatusCode } from '../enum/http-status-code'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'

@RestController('/panels')
export class PanelController extends BaseController {
  public constructor(
    private readonly physicalPanelLayoutRepository: PhysicalPanelLayoutRepository,
    private readonly panelLayoutConfigurationService: PanelService,
    private readonly httpResponseFormatter: HttpResponseFormatter,
    private readonly httpErrorHandler: HttpErrorHandler
  ) {
    super()
  }

  @GetRequest('/physicalPanelLayouts')
  public async getPhysicalPanelLayouts(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const physicalPanelLayouts: PhysicalPanelLayout[] = this.physicalPanelLayoutRepository.getPhysicalPanelLayouts()
      await this.sendOkReply(reply, physicalPanelLayouts)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  private async sendOkReply(reply: FastifyReply, data: unknown): Promise<void> {
    await reply.code(HttpStatusCode.OK).send(this.httpResponseFormatter.formatSuccessResponse(data))
  }

  @GetRequest('/panelLayoutConfigurations/:id')
  public async getPanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = await this.panelLayoutConfigurationService.getPanelLayoutConfiguration(request.params.id)
      await this.sendOkReply(reply, new PanelLayoutConfigurationDto(panelLayoutConfiguration))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @GetRequest('/panelLayoutConfigurations')
  public async getPanelLayoutConfigurations(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfigurations: PanelLayoutConfiguration[] = await this.panelLayoutConfigurationService.getPanelLayoutConfigurations()
      await this.sendOkReply(reply, panelLayoutConfigurations.map(panelLayoutConfiguration => new PanelLayoutConfigurationDto(panelLayoutConfiguration)))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @PostRequest('/panelLayoutConfigurations', ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID)
  public async createPanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelLayoutConfigurationService.createPanelLayoutConfiguration(panelLayoutConfiguration)
      await this.sendOkReply(reply, panelLayoutConfiguration)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @PutRequest('/panelLayoutConfigurations', ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA)
  public async updatePanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelLayoutConfigurationService.updatePanelLayoutConfiguration(panelLayoutConfiguration)
      await this.sendOkReply(reply, `Successfully updated PanelLayoutConfiguration for ${panelLayoutConfiguration.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @DeleteRequest('/panelLayoutConfigurations/:id')
  public async deletePanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      await this.panelLayoutConfigurationService.deletePanelLayoutConfiguration(request.params.id)
      await this.sendOkReply(reply, `Successfully deleted PanelLayoutConfiguration for ${request.params.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }
}
