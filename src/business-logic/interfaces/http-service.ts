export interface HttpService {
  get(url: string): Promise<unknown>
  put(url: string, body?: unknown): Promise<void>
}
