import { ProxyServer } from './interfaces/proxy-server'
import createFastifyServer, * as fastify from 'fastify'
import { fastifyHttpProxy } from '@fastify/http-proxy'

export interface ProxyConfiguration {
  httpUrl: string
  websocketUrl: string
}
export class FastifyServer implements ProxyServer {
  private readonly fastifyServer: fastify.FastifyInstance = createFastifyServer()

  public constructor(private readonly proxyConfiguration: ProxyConfiguration) {}

  public async start(port: number): Promise<void> {
    await this.configureProxy()
    await this.fastifyServer.listen({ port })
    console.log(`Running proxy server on port ${port} redirecting HTTP requests to ${this.proxyConfiguration.httpUrl} and WebSocket connections to ${this.proxyConfiguration.websocketUrl}.`)
  }

  private async configureProxy(): Promise<void> {
    await this.fastifyServer.register(fastifyHttpProxy, {
      upstream: this.proxyConfiguration.httpUrl,
      websocket: true,
      wsUpstream: this.proxyConfiguration.websocketUrl,
    })
  }

  public async stop(): Promise<void> {
    await this.fastifyServer.close()
  }
}
