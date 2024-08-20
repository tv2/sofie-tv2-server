export interface ProxyServer {
  start(port: number): Promise<void>
  stop(): Promise<void>
}
