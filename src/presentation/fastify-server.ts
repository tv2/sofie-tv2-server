import { ProxyServer } from './interfaces/proxy-server'
import createFastifyServer, * as fastify from 'fastify'
import { fastifyHttpProxy } from '@fastify/http-proxy'
import { Logger } from '@tv2media/logger'
import { ProxyConfiguration } from './value-objects/proxy-configuration'
import { BaseController, Route } from './controllers/base-controller'
import { RouteOptions } from 'fastify/types/route'

export class FastifyServer implements ProxyServer {
  private readonly fastifyServer: fastify.FastifyInstance = createFastifyServer()
  private readonly logger: Logger

  public constructor(logger: Logger, private readonly controllers: BaseController[]) {
    this.logger = logger.tag(this.constructor.name)
  }

  public async start(port: number, proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.configureProxy(proxyConfiguration)
    this.setupControllers()
    await this.fastifyServer.listen({ port })

    this.logger.info(`Running proxy server on port ${port}.\nHTTP requests are redirected to ${proxyConfiguration.httpUrl} and WebSocket connections to ${proxyConfiguration.websocketUrl}.`)
  }

  private async configureProxy(proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.fastifyServer.register(fastifyHttpProxy, {
      upstream: proxyConfiguration.httpUrl,
      websocket: true,
      wsUpstream: proxyConfiguration.websocketUrl,
    })
  }

  private setupControllers(): void {
    const fastifyRouteOptions: RouteOptions[] = this.controllers.flatMap(controller => controller.getRoutes()).map(this.mapRouteToFastifyRouteOptions)
    fastifyRouteOptions.forEach(routeOptions => this.fastifyServer.route(routeOptions))
  }

  private mapRouteToFastifyRouteOptions(route: Route): RouteOptions {
    return {
      method: route.method,
      url: `/api${route.path}`,
      handler: route.action,
    }
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close()
  }
}
