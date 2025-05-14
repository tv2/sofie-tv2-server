import { ProxyServer } from './interfaces/proxy-server'
import { FastifyServer } from './fastify-server'
import { Logger } from '../logger/logger'
import { BaseController } from './controllers/base-controller'
import { ControllerFacade } from './facades/controller-facade'
import { LoggerFacade } from '../logger/logger-facade'
import { RepositoryFacade } from '../data-access/repository-facade'
import { ServiceFacade } from '../business-logic/facades/service-facade'
import { DomainEventFacade } from '../business-logic/facades/domain-event-facade'
import { EventBuilderFacade } from './facades/event-builder-facade'

const ALBA_REST_URL: string = process.env.ALBA_REST_URL ?? 'http://localhost:3005'
const ALBA_WEBSOCKET_URL: string = process.env.ALBA_WEBSOCKET_URL ?? 'ws://localhost:3006'
const PROXY_SERVER_PORT: number = Number.parseInt(process.env.ALBA_TV2_SERVER_PORT ?? '3010')
const RETRY_SYSTEM_SERVICES_DELAY_IN_MS: number = 5000

const controllers: BaseController[] = ControllerFacade.getControllers()

async function startAlbaTv2Server(logger: Logger): Promise<void> {
  await connectToDatabase(logger)
  await startProxyServer(logger).catch(error => logger.data(error).error('Failed to start proxy server.'))
  await startSystemServices()
  logger.info('Alba TV2 Server successfully started')
}

async function startProxyServer(logger: Logger): Promise<void> {
  const proxyServer: ProxyServer = new FastifyServer(
    logger,
    controllers,
    DomainEventFacade.createPanelObserver(),
    EventBuilderFacade.createPanelEventBuilder(),
    DomainEventFacade.createStatusMessageObserver(),
    DomainEventFacade.createDeviceEmitter(),
    DomainEventFacade.createRundownEmitter(),
    DomainEventFacade.createActionEmitter(),
    DomainEventFacade.createPlayoutContentEmitter()
  )
  await proxyServer.start(PROXY_SERVER_PORT, { httpUrl: ALBA_REST_URL, websocketUrl: ALBA_WEBSOCKET_URL })
}

async function connectToDatabase(logger: Logger): Promise<void> {
  await RepositoryFacade.getDatabase().connect().catch(error => logger.data(error).error('Failed to connect to database'))
}

async function startSystemServices(): Promise<void> {
  try {
    await ServiceFacade.createPanelManager().initialize()
    ServiceFacade.createInvokedActionService()
  } catch {
    setTimeout(() => {
      logger.error(`Failed while starting system services. Retrying in ${RETRY_SYSTEM_SERVICES_DELAY_IN_MS / 1000} seconds.`)
      startSystemServices().catch(error => logger.data(error).error('Failed to initialize the Panel Manager.'))
    }, RETRY_SYSTEM_SERVICES_DELAY_IN_MS)
  }
}

const logger: Logger = LoggerFacade.createLogger().tag('startup')
startAlbaTv2Server(logger).catch(error => logger.data(error).error('Failed to start Alba TV2 Server'))
