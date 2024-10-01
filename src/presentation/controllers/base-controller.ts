import 'reflect-metadata'
import { JSONSchema7 } from 'json-schema'

type MethodDecorator = (target: object, methodName: string) => void
type Constructor = { prototype: object }
type RouteDecorator = (constructor: Constructor) => void
type Action = (...args: unknown[]) => void

enum ControllerMetadata {
  METHODS = 'routable-methods',
  PATHS = 'routable-paths',
  BASE_PATH = 'routable-base-path',
  VALIDATION_SCHEMA = 'validation-schema',
}

enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

interface Route {
  path: string
  method: Method
  action: Action
  validationSchema: JSONSchema7 | undefined
}

export abstract class BaseController {
  public getRoutes(): Route[] {
    const methods = getMethods(this)
    const paths = getPaths(this)
    const validationSchemas = getValidationSchemas(this)
    return [...methods.keys()].map((methodName: string) => ({
      path: this.getFullPath(paths.get(methodName) ?? ''),
      method: methods.get(methodName) ?? Method.GET,
      action: this.getAction(methodName as keyof this),
      validationSchema: validationSchemas.get(methodName),
    }))
  }

  private getFullPath(path: string): string {
    const basePath = getBasePath(this)
    return `/${basePath}/${path}`.replace(/\/+/g, '/').replace(/(?<!^)\/$/g, '')
  }

  private getAction(methodName: keyof this): Action {
    return this[methodName] as unknown as Action
  }
}

export function RestController(path: string): RouteDecorator {
  return (constructor: Constructor) => setBasePath(constructor.prototype, path)
}

function getBasePath(target: object): string {
  return Reflect.getMetadata(ControllerMetadata.BASE_PATH, target) ?? ''
}
function setBasePath(target: object, path: string): void {
  Reflect.defineMetadata(ControllerMetadata.BASE_PATH, path, target)
}

export function GetRequest(path?: string): MethodDecorator {
  return (target: object, methodName: string) => setRoute(target, methodName, Method.GET, path)
}

export function PostRequest(path?: string, validationSchema?: JSONSchema7): MethodDecorator {
  return (target: object, methodName: string) => setRoute(target, methodName, Method.POST, path, validationSchema)
}

export function PutRequest(path?: string): MethodDecorator {
  return (target: object, methodName: string) => setRoute(target, methodName, Method.PUT, path)
}

export function DeleteRequest(path?: string): MethodDecorator {
  return (target: object, methodName: string) => setRoute(target, methodName, Method.DELETE, path)
}

function setRoute(target: object, methodName: string, method: Method, path?: string, validationSchema?: JSONSchema7): void {
  if (path) {
    setPath(target, methodName, path)
  }
  if (validationSchema) {
    setValidationSchema(target, methodName, validationSchema)
  }
  setMethod(target, methodName, method)
}

function setPath(target: object, methodName: string, path: string): void {
  const paths = getPaths(target)
  paths.set(methodName, path)
  setPaths(target, paths)
}

function getPaths(target: object): Map<string, string> {
  return Reflect.getMetadata(ControllerMetadata.PATHS, target) ?? new Map()
}

function setPaths(target: object, paths: Map<string, string>): void {
  Reflect.defineMetadata(ControllerMetadata.PATHS, paths, target)
}

function setMethod(target: object, methodName: string, method: Method): void {
  const methods = getMethods(target)
  methods.set(methodName, method)
  setMethods(target, methods)
}

function getMethods(target: object): Map<string, Method> {
  return Reflect.getMetadata(ControllerMetadata.METHODS, target) ?? new Map()
}

function setMethods(target: object, methods: Map<string, Method>): void {
  Reflect.defineMetadata(ControllerMetadata.METHODS, methods, target)
}

function setValidationSchema(target: object, methodName: string, validationSchema: JSONSchema7): void {
  const validationSchemas = getValidationSchemas(target)
  validationSchemas.set(methodName, validationSchema)
  setValidationSchemas(target, validationSchemas)
}

function getValidationSchemas(target: object): Map<string, JSONSchema7> {
  return Reflect.getMetadata(ControllerMetadata.VALIDATION_SCHEMA, target) ?? new Map()
}

function setValidationSchemas(target: object, schemas: Map<string, JSONSchema7>): void {
  Reflect.defineMetadata(ControllerMetadata.VALIDATION_SCHEMA, schemas, target)
}
