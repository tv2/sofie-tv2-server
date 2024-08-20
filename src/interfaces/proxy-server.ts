export interface ProxyServer {
  start(): Promise<void>
  stop(): Promise<void>
}
