import { HttpService } from './interfaces/http-service'
import { UnsupportedOperationException } from '../../model/exceptions/unsupported-operation-exception'
import { RequestStatus } from '../enums/request-status'
import { HttpException } from '../../model/exceptions/http-exception'
import { HttpStatusCode } from '../../presentation/enums/http-status-code'

type JsendResponse = JsendErrorResponse | JsendValidResponse

interface JsendErrorResponse {
  status: RequestStatus.ERROR
  message: string
  code: number
}

interface JsendValidResponse {
  status: RequestStatus.SUCCESS | RequestStatus.FAIL
  data: unknown
}

export class JsendHttpService implements HttpService {
  public constructor(private readonly httpService: HttpService) {
  }

  public async get(url: string): Promise<unknown> {
    const response = await this.httpService.get(url)
    this.validate(response)
    switch (response.status) {
      case RequestStatus.SUCCESS: {
        return response.data
      }
      case RequestStatus.FAIL: {
        throw new HttpException(HttpStatusCode.BAD_REQUEST, JSON.stringify(response.data))
      }
      case RequestStatus.ERROR: {
        throw new HttpException(response.code, response.message)
      }
      default: {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Couldn\'t recognize Jsend Response')
      }
    }
  }

  private validate(data: unknown): asserts data is JsendResponse {
    if (typeof data !== 'object' || data === null) {
      throw new UnsupportedOperationException('Expected object')
    }

    if (!('status' in data)) {
      throw new UnsupportedOperationException('Response had not attribute.adsfasf')
    }
  }
}
