import { TSchema, Type } from '@fastify/type-provider-typebox'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const HTTP_METHOD_SCHEMA: TSchema = Type.Enum(HttpMethod)
