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
  status: RequestStatus.SUCCESS
  data: unknown
}

export class JsendHttpService implements HttpService {
  public constructor(private readonly httpService: HttpService) {
  }

  public async get(url: string): Promise<unknown> {
    const response: unknown = await this.httpService.get(url)
    this.assertJsendResponse(response)
    switch (response.status) {
      case RequestStatus.SUCCESS: {
        return response.data
      }
      case RequestStatus.ERROR: {
        throw new HttpException(response.code, response.message)
      }
      default: {
        throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, 'Couldn\'t recognize Jsend Response')
      }
    }
  }

  private assertJsendResponse(data: unknown): asserts data is JsendResponse {
    if (typeof data !== 'object' || data === null) {
      throw new UnsupportedOperationException(`Expected JSend response to be an object, but received ${typeof data}`)
    }

    if (!('status' in data)) {
      throw new UnsupportedOperationException('Expected JSend response to have the attribute \'status\'')
    }
  }
}
