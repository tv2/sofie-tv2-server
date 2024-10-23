import { ProxyServer } from './interfaces/proxy-server'
import createFastifyServer, * as fastify from 'fastify'
import { FastifySchema } from 'fastify'
import { fastifyHttpProxy } from '@fastify/http-proxy'
import { ProxyConfiguration } from './value-objects/proxy-configuration'
import { BaseController } from './controllers/base-controller'
import { RouteOptions } from 'fastify/types/route'
import { Logger } from '../logger/logger'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastifyWebsocket } from '@fastify/websocket'
import WebSocket, { MessageEvent } from 'ws'
import { PanelEventObserver } from './interfaces/panel-event-observer'
import { PanelEvent } from './value-objects/panel-event'
import { StatusMessageEventObserver } from './interfaces/status-message-event-observer'
import { StatusMessageEvent } from './value-objects/status-message-event'

const RECONNECT_DELAY_IN_MS: number = 5_000

export class FastifyServer implements ProxyServer {
  private readonly fastifyServer: fastify.FastifyInstance = createFastifyServer()
  private readonly logger: Logger

  public constructor(
    logger: Logger,
    private readonly controllers: BaseController[],
    private readonly panelEventObserver: PanelEventObserver,
    private readonly statusMessageObserver: StatusMessageEventObserver
  ) {
    this.logger = logger.tag(this.constructor.name)
  }

  public async start(port: number, proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.configureProxy(proxyConfiguration)
    this.addCors()
    await this.setupWebSocketServer(proxyConfiguration)
    this.setupControllers()
    await this.fastifyServer.listen({ port })

    this.logger.info(`Running proxy server on port ${port}.\nHTTP requests are redirected to ${proxyConfiguration.httpUrl} and WebSocket connections to ${proxyConfiguration.websocketUrl}.`)
  }

  private async configureProxy(proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.fastifyServer.register(fastifyHttpProxy, {
      upstream: proxyConfiguration.httpUrl,
    })
  }

  // The below eslint-disable is necessary.
  // If we add 'await' or .then().catch() we will get a 'MaxListenerExceededWarning: Possible EventEmitter memory leak detected.'
  /* eslint-disable @typescript-eslint/no-floating-promises */
  private addCors(): void {
    this.fastifyServer.addHook('onRequest', async(request, reply) => {
      reply.header('Access-Control-Allow-Origin', '*')
      reply.header('Access-Control-Allow-Credentials', true)
      reply.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept, X-Slug, X-UID')
      reply.header('Access-Control-Allow-Methods', 'OPTIONS, POST, PUT, PATCH, GET, DELETE')
      if (request.method === 'OPTIONS') {
        reply.send()
      }
    })
  }

  private async setupWebSocketServer(proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.fastifyServer.register(fastifyWebsocket)
    this.fastifyServer.get('/ws', { websocket: true }, (socket: WebSocket) => {
      this.panelEventObserver.subscribeToPanelEvents((panelEvent: PanelEvent) => socket.send(JSON.stringify(panelEvent)))
      this.statusMessageObserver.subscribeToStatusMessageEvents((statusMessageEvent: StatusMessageEvent) => socket.send(JSON.stringify(statusMessageEvent)))
    })

    this.connectToAlbaServer(proxyConfiguration)
  }

  private connectToAlbaServer(proxyConfiguration: ProxyConfiguration): void {
    const albaWebSocket: WebSocket = new WebSocket(proxyConfiguration.websocketUrl)
    albaWebSocket.addEventListener('open', () => this.logger.debug('Connected to AlbaServer'))

    albaWebSocket.addEventListener('close', () => {
      this.logger.debug('Disconnected from Alba Server')
      setTimeout(() => this.connectToAlbaServer(proxyConfiguration), RECONNECT_DELAY_IN_MS)
    })

    albaWebSocket.addEventListener('message', (message: MessageEvent) => {
      this.fastifyServer.websocketServer.clients.forEach(client => client.send(message.data))
    })

    this.fastifyServer.setValidatorCompiler(validatorCompiler)
    this.fastifyServer.setSerializerCompiler(serializerCompiler)
    this.fastifyServer.withTypeProvider<ZodTypeProvider>()
  }

  private setupControllers(): void {
    const fastifyRouteOptions: RouteOptions[] = this.controllers.flatMap(this.mapRouteToFastifyRouteOptions)
    fastifyRouteOptions.forEach(routeOptions => this.fastifyServer.route(routeOptions))
  }

  private mapRouteToFastifyRouteOptions(controller: BaseController): RouteOptions[] {
    return controller.getRoutes().map((route) => {
      const schema: FastifySchema = {}

      if (route.validationSchema) {
        schema.body = route.validationSchema
      }

      return {
        method: route.method,
        url: `/api${route.path}`,
        handler: route.action.bind(controller),
        schema,
      }
    })
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close()
  }
}
