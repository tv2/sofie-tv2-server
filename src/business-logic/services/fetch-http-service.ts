import { HttpService } from '../interfaces/http-service'
import { HttpException } from '../../model/exceptions/http-exception'

export class FetchHttpService implements HttpService {
  public async get(url: string): Promise<unknown> {
    const response: Response = await fetch(url)
    if (!response.ok) {
      throw new HttpException(response.status, await response.text())
    }
    return response.json()
  }

  public async put(url: string, body?: unknown): Promise<void> {
    const response: Response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new HttpException(response.status, await response.text())
    }
  }
}
