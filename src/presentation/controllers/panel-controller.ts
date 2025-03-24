import { BaseController, DeleteRequest, GetRequest, PostRequest, PutRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { PhysicalPanelLayoutRepository } from '../../data-access/physical-panel-layout-repository'
import { PhysicalPanelLayout } from '../../model/interfaces/physical-panel-layout'
import {
  PanelLayoutConfiguration,
  ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID,
  ZOD_UPDATE_PANEL_LAYOUT_CONFIGURATION_SCHEMA,
} from '../../model/interfaces/panel-layout-configuration'
import { PanelService } from '../../business-logic/interfaces/panel-service'
import { PanelLayoutConfigurationDto } from '../dtos/panel-layout-configuration-dto'
import { HttpErrorHandler } from '../services/http-error-handler'
import { HttpStatusCode } from '../enums/http-status-code'
import {
  PanelConfiguration,
  ZOD_PANEL_CONFIGURATION_SCHEMA,
  ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID
} from '../../model/interfaces/panel-configuration'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'
import { PanelConfigurationDto } from '../dtos/panel-configuration-dto'
import {
  PanelInputModifier,
  ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITHOUT_ID
} from '../../model/interfaces/panel-input-modifier'
import { PanelInputModifierDto } from '../dtos/panel-input-modifier-dto'
import { AuditLog } from '../decorators/audit-log-decorator'

@RestController('/panels')
export class PanelController extends BaseController {
  public constructor(
    private readonly physicalPanelLayoutRepository: PhysicalPanelLayoutRepository,
    private readonly panelService: PanelService,
    private readonly httpResponseFormatter: HttpResponseFormatter,
    private readonly httpErrorHandler: HttpErrorHandler
  ) {
    super()
  }

  @AuditLog()
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

  @AuditLog()
  @GetRequest('/panelLayoutConfigurations/:id')
  public async getPanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = await this.panelService.getPanelLayoutConfiguration(request.params.id)
      await this.sendOkReply(reply, new PanelLayoutConfigurationDto(panelLayoutConfiguration))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @GetRequest('/panelLayoutConfigurations')
  public async getPanelLayoutConfigurations(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfigurations: PanelLayoutConfiguration[] = await this.panelService.getPanelLayoutConfigurations()
      await this.sendOkReply(reply, panelLayoutConfigurations.map(panelLayoutConfiguration => new PanelLayoutConfigurationDto(panelLayoutConfiguration)))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @PostRequest('/panelLayoutConfigurations', ZOD_PANEL_LAYOUT_CONFIGURATION_SCHEMA_WITHOUT_ID)
  public async createPanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelService.createPanelLayoutConfiguration(panelLayoutConfiguration)
      await this.sendOkReply(reply, 'Successfully created PanelLayoutConfiguration')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @PutRequest('/panelLayoutConfigurations', ZOD_UPDATE_PANEL_LAYOUT_CONFIGURATION_SCHEMA)
  public async updatePanelLayoutConfiguration(request: FastifyRequest<{ Body: PanelLayoutConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelLayoutConfiguration: PanelLayoutConfiguration = request.body
      await this.panelService.updatePanelLayoutConfiguration(panelLayoutConfiguration)
      await this.sendOkReply(reply, `Successfully updated PanelLayoutConfiguration for ${panelLayoutConfiguration.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @DeleteRequest('/panelLayoutConfigurations/:id')
  public async deletePanelLayoutConfiguration(request: FastifyRequest<{ Params: Pick<PanelLayoutConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      await this.panelService.deletePanelLayoutConfiguration(request.params.id)
      await this.sendOkReply(reply, `Successfully deleted PanelLayoutConfiguration for ${request.params.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @GetRequest('/panelConfigurations/:id')
  public async getPanelConfiguration(request: FastifyRequest<{ Params: Pick<PanelConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      const panelConfiguration: PanelConfiguration = await this.panelService.getPanelConfiguration(request.params.id)
      await this.sendOkReply(reply, new PanelConfigurationDto(panelConfiguration))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @GetRequest('/panelConfigurations')
  public async getPanelConfigurations(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelConfigurations: PanelConfiguration[] = await this.panelService.getPanelConfigurations()
      await this.sendOkReply(reply, panelConfigurations.map(panelConfiguration => new PanelConfigurationDto(panelConfiguration)))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @PostRequest('/panelConfigurations', ZOD_PANEL_CONFIGURATION_SCHEMA_WITHOUT_ID)
  public async createPanelConfiguration(request: FastifyRequest<{ Body: PanelConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelConfiguration: PanelConfiguration = request.body
      await this.panelService.createPanelConfiguration(panelConfiguration)
      await this.sendOkReply(reply, 'Successfully created PanelConfiguration')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @PutRequest('/panelConfigurations', ZOD_PANEL_CONFIGURATION_SCHEMA)
  public async updatePanelConfiguration(request: FastifyRequest<{ Body: PanelConfiguration }>, reply: FastifyReply): Promise<void> {
    try {
      const panelConfiguration: PanelConfiguration = request.body
      await this.panelService.updatePanelConfiguration(panelConfiguration)
      await this.sendOkReply(reply, 'Successfully updated PanelConfiguration')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @DeleteRequest('/panelConfigurations/:id')
  public async deletePanelConfiguration(request: FastifyRequest<{ Params: Pick<PanelConfiguration, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      await this.panelService.deletePanelConfiguration(request.params.id)
      await this.sendOkReply(reply, `Successfully deleted PanelConfiguration for ${request.params.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @GetRequest('/panelInputModifiers')
  public async getPanelInputModifiers(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelInputModifiers: PanelInputModifier[] = await this.panelService.getPanelInputModifiers()
      await this.sendOkReply(reply, panelInputModifiers.map(panelInputModifier => new PanelInputModifierDto(panelInputModifier)))
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @PostRequest('/panelInputModifiers', ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITHOUT_ID)
  public async createPanelInputModifier(request: FastifyRequest<{ Body: PanelInputModifier }>, reply: FastifyReply): Promise<void> {
    try {
      const panelInputModifier: PanelInputModifier = request.body
      await this.panelService.createPanelInputModifier(panelInputModifier)
      await this.sendOkReply(reply, 'Successfully create PanelInputModifier')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  @AuditLog()
  @DeleteRequest('/panelInputModifiers/:id')
  public async deletePanelInputModifier(request: FastifyRequest<{ Params: Pick<PanelInputModifier, 'id'> }>, reply: FastifyReply): Promise<void> {
    try {
      await this.panelService.deletedPanelInputModifier(request.params.id)
      await this.sendOkReply(reply, `Successfully deleted PanelInputModifier for ${request.params.id}`)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }
}
