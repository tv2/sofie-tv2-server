import { BaseController, GetRequest, PostRequest, RestController } from './base-controller'
import { FastifyReply, FastifyRequest } from 'fastify'
import { HttpErrorHandler } from '../services/http-error-handler'
import { PanelInputModifierRepository } from '../../data-access/interfaces/panel-input-modifier-repository'
import {
  PanelInputModifier,
  ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITHOUT_ID
} from '../../model/interfaces/panel-input-modifier'
import { HttpStatusCode } from '../enums/http-status-code'
import { HttpResponseFormatter } from '../interfaces/http-response-formatter'

@RestController('/panel-input-modifiers')
export class PanelInputModifierController extends BaseController {
  public constructor(
    private readonly panelInputModifierRepository: PanelInputModifierRepository,
    private readonly httpResponseFormatter: HttpResponseFormatter,
    private readonly httpErrorHandler: HttpErrorHandler
  ) {
    super()
  }

  @GetRequest()
  public async getPanelInputModifiers(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const panelInputModifiers: PanelInputModifier[] = await this.panelInputModifierRepository.getPanelInputModifiers()
      await this.sendOkReply(reply, panelInputModifiers)
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }

  private async sendOkReply(reply: FastifyReply, data: unknown): Promise<void> {
    await reply.code(HttpStatusCode.OK).send(this.httpResponseFormatter.formatSuccessResponse(data))
  }

  @PostRequest('', ZOD_PANEL_INPUT_MODIFIER_SCHEMA_WITHOUT_ID)
  public async createPanelInputModifier(request: FastifyRequest<{ Body: PanelInputModifier }>, reply: FastifyReply): Promise<void> {
    try {
      const panelInputModifier: PanelInputModifier = request.body
      await this.panelInputModifierRepository.createPanelInputModifier(panelInputModifier)
      await this.sendOkReply(reply, 'Successfully create PanelInputModifier')
    } catch (error) {
      await this.httpErrorHandler.handleError(reply, error)
    }
  }
}
