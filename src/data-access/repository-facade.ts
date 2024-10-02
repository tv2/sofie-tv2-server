import { PhysicalPanelLayoutRepository } from './physical-panel-layout-repository'
import { PanelLayoutConfigurationRepository } from './interfaces/panel-layout-configuration-repository'
import { MongoPanelLayoutConfigurationRepository } from './mongo/mongo-panel-layout-configuration-repository'
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

  public static createPanelLayoutConfigurationRepository(): PanelLayoutConfigurationRepository {
    return new MongoPanelLayoutConfigurationRepository(this.createMongoDatabase(), this.createUuidGenerator())
  }

  private static createUuidGenerator(): UuidGenerator {
    return new CryptoUuidGenerator()
  }
}
