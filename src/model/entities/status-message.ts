import { StatusCode } from '../enums/status-code'

export interface StatusMessage {
  id: string
  title: string
  message: string
  statusCode: StatusCode
  lastUpdatedTimestamp: number
}
