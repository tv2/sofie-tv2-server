import { HttpService } from '../interfaces/http-service'

const ALBA_API_BASE_URL: string = process.env.ALBA_API_BASE_URL ?? 'http://localhost:3005/api'

export class AlbaServerHttpService implements HttpService {
  public constructor(private readonly httpService: HttpService) {
  }

  public get(url: string): Promise<unknown> {
    return this.httpService.get(`${ALBA_API_BASE_URL}${this.prefixUrlWithSlash(url)}`)
  }

  private prefixUrlWithSlash(url: string): string {
    return url.replace(/^\/*/, '/')
  }

  public put(url: string, body?: unknown): Promise<void> {
    return this.httpService.put(`${ALBA_API_BASE_URL}${this.prefixUrlWithSlash(url)}`, body)
  }
}
