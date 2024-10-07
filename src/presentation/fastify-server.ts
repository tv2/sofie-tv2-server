import { ProxyServer } from './interfaces/proxy-server'
import createFastifyServer, * as fastify from 'fastify'
import { FastifySchema } from 'fastify'
import { fastifyHttpProxy } from '@fastify/http-proxy'
import { ProxyConfiguration } from './value-objects/proxy-configuration'
import { BaseController } from './controllers/base-controller'
import { RouteOptions } from 'fastify/types/route'
import { Logger } from '../logger/logger'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

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
