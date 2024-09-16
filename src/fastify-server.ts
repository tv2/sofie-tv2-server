import { ProxyServer } from './interfaces/proxy-server'
import createFastifyServer, * as fastify from 'fastify'
import { fastifyHttpProxy } from '@fastify/http-proxy'
import { Logger } from '@tv2media/logger'
import { ProxyConfiguration } from './value-objects/proxy-configuration'

export class FastifyServer implements ProxyServer {
  private readonly fastifyServer: fastify.FastifyInstance = createFastifyServer()
  private readonly logger: Logger

  public constructor(logger: Logger) {
    this.logger = logger.tag(this.constructor.name)
  }

  public async start(port: number, proxyConfiguration: ProxyConfiguration): Promise<void> {
    await this.configureProxy(proxyConfiguration)
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

  public async stop(): Promise<void> {
    await this.fastifyServer.close()
  }
}
