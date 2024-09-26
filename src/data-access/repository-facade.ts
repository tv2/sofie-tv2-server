import { PhysicalPanelLayoutRepository } from './physical-panel-layout-repository'
import { ConfiguredPanelLayoutRepository } from './interfaces/configured-panel-layout-repository'
import { MongoConfiguredPanelLayoutRepository } from './mongo/mongo-configured-panel-layout-repository'
import { Database } from './interfaces/database'
import { MongoDatabase } from './mongo/mongo-database'
import { LoggerFacade } from '../logger/logger-facade'
import { UuidGenerator } from './interfaces/uuid-generator'
import { CryptoUuidGenerator } from './crypto-uuid-generator'

export class RepositoryFacade {
  public static createPhysicalPanelLayoutRepository(): PhysicalPanelLayoutRepository {
    return new PhysicalPanelLayoutRepository()
  }

  public static getDatabase(): Database {
    return this.createMongoDatabase()
  }

  private static createMongoDatabase(): MongoDatabase {
    return MongoDatabase.getInstance(LoggerFacade.createLogger())
  }

  public static createConfiguredPanelLayoutRepository(): ConfiguredPanelLayoutRepository {
    return new MongoConfiguredPanelLayoutRepository(this.createMongoDatabase(), this.createUuidGenerator())
  }

  private static createUuidGenerator(): UuidGenerator {
    return new CryptoUuidGenerator()
  }
}
