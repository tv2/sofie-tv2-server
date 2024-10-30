import { HttpService } from '../interfaces/http-service'

const ALBA_API_BASE_URL: string = process.env.ALBA_API_BASE_URL ?? 'http://localhost:3005/api'

export class AlbaServerHttpService implements HttpService {
  public constructor(private readonly httpService: HttpService) {
  }

  public get(url: string): Promise<unknown> {
    if (!url.startsWith('/')) {
      url = `/${url}`
    }
    return this.httpService.get(`${ALBA_API_BASE_URL}${url}`)
  }
}
