import { ProxyServer } from './interfaces/proxy-server'
import { FastifyServer } from './fastify-server'

const SOFIE_REST_URL: string = 'http://localhost:3005'
const SOFIE_WEBSOCKET_URL: string = 'ws://localhost:3006'
const PROXY_SERVER_PORT: number = 3010

async function configureSystemServices(): Promise<void> {
  const proxyServer: ProxyServer = new FastifyServer({ httpUrl: SOFIE_REST_URL, websocketUrl: SOFIE_WEBSOCKET_URL })
  await proxyServer.start(PROXY_SERVER_PORT)
}

// TODO: Add logger
configureSystemServices().catch(console.error)
