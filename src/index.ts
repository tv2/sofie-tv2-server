import { ProxyServer } from './interfaces/proxy-server'
import { FastifyServer } from './fastify-server'
import { ConsoleLogger } from './console-logger'
import { Logger } from './interfaces/logger'

const SOFIE_REST_URL: string = 'http://localhost:3005'
const SOFIE_WEBSOCKET_URL: string = 'ws://localhost:3006'
const PROXY_SERVER_PORT: number = 3010

async function configureSystemServices(logger: Logger): Promise<void> {
  const proxyServer: ProxyServer = new FastifyServer({ httpUrl: SOFIE_REST_URL, websocketUrl: SOFIE_WEBSOCKET_URL }, logger)
  await proxyServer.start(PROXY_SERVER_PORT)
}

const logger: Logger = new ConsoleLogger().tag('startup')
configureSystemServices(logger).catch(error => logger.data(error).error('Failed to configure system services.'))
