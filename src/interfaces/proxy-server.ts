import { ProxyConfiguration } from '../value-objects/proxy-configuration'

export interface ProxyServer {
  start(port: number, proxyConfiguration: ProxyConfiguration): Promise<void>
  stop(): Promise<void>
}
