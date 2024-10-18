import { ProxyServer } from './interfaces/proxy-server'
import { FastifyServer } from './fastify-server'
import { Logger } from '../logger/logger'
import { BaseController } from './controllers/base-controller'
import { ControllerFacade } from './facades/controller-facade'
import { LoggerFacade } from '../logger/logger-facade'
import { RepositoryFacade } from '../data-access/repository-facade'
import { EventEmitterFacade } from './facades/event-emitter-facade'
import { ServiceFacade } from '../business-logic/services/facade/service-facade'

const SOFIE_REST_URL: string = 'http://localhost:3005'
const SOFIE_WEBSOCKET_URL: string = 'ws://localhost:3006'
const PROXY_SERVER_PORT: number = 3010

const controllers: BaseController[] = ControllerFacade.getControllers()

async function startAlbaTv2Server(logger: Logger): Promise<void> {
  await connectToDatabase(logger)
  await startSystemServices()
  startProxyServer(logger).catch(error => logger.data(error).error('Failed to start proxy server'))
}

async function startProxyServer(logger: Logger): Promise<void> {
  const proxyServer: ProxyServer = new FastifyServer(logger, controllers, EventEmitterFacade.createPanelEventObserver())
  await proxyServer.start(PROXY_SERVER_PORT, { httpUrl: SOFIE_REST_URL, websocketUrl: SOFIE_WEBSOCKET_URL })
}

async function connectToDatabase(logger: Logger): Promise<void> {
  await RepositoryFacade.getDatabase().connect().catch(error => logger.data(error).error('Failed to connect to database'))
}

async function startSystemServices(): Promise<void> {
  await ServiceFacade.createPanelManager().initialize()
}

const logger: Logger = LoggerFacade.createLogger().tag('startup')
startAlbaTv2Server(logger).catch(error => logger.data(error).error('Failed to start Alba TV2 Server'))
