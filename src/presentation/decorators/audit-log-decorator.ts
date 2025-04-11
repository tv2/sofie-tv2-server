import { LoggerFacade } from '../../logger/logger-facade'
import { Logger } from '../../logger/logger'

interface Request {
  body?: unknown
  params?: unknown
}

export function AuditLog(): MethodDecorator {
  const logger: Logger = LoggerFacade.createLogger()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_target: unknown, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void => {
    const originalMethod: () => unknown = descriptor.value as () => unknown
    descriptor.value = function(...args: unknown[]): void {
      const argumentMessage: string = extractArgumentMessageFromRequest(args)
      logger.trace(`AuditLog - Method: "${JSON.stringify(propertyKey)}". ${argumentMessage}`)
      originalMethod.apply(this, args as []) // The "as []" is to comply with "yarn build".
    }
  }
}

function extractArgumentMessageFromRequest(args: unknown[]): string {
  for (let i: number = 0; i < args.length; i++) {
    const arg: Request = args[i] as Request
    if (!arg.body && !arg.params) {
      // Not an Request
      continue
    }

    const argument: string = arg.params && Object.keys(arg.params).length !== 0 ? `Arguments: ${JSON.stringify(arg.params)}` : ''
    const body: string = arg.body && Object.keys(arg.body).length !== 0 ? `Body: ${JSON.stringify(arg.body)}` : ''
    return `${argument}${argument.length > 0 ? ' ' : ''}${body}`
  }

  return ''
}
