import { PlainTextFormat } from '@tv2media/logger'
import { ConsoleVault, NodeEnvironmentLogger } from '@tv2media/logger/node'
import { LogLevel, Logger } from './interfaces/logger'

export class ConsoleLogger extends NodeEnvironmentLogger implements Logger {
  public constructor() {
    super([
      new ConsoleVault({
        level: LogLevel.TRACE,
        format: new PlainTextFormat(),
        isFormatLocked: false,
      }),
    ])
  }
}
