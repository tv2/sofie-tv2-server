import { PhysicalPanelLayoutRepository } from './physical-panel-layout-repository'
import { PanelLayoutConfigurationRepository } from './interfaces/panel-layout-configuration-repository'
import { MongoPanelLayoutConfigurationRepository } from './mongo/mongo-panel-layout-configuration-repository'
import { Database } from './interfaces/database'
import { MongoDatabase } from './mongo/mongo-database'
import { LoggerFacade } from '../logger/logger-facade'
import { UuidGenerator } from './interfaces/uuid-generator'
import { CryptoUuidGenerator } from './crypto-uuid-generator'
import { PanelConfigurationRepository } from './interfaces/panel-configuration-repository'
import { MongoPanelConfigurationRepository } from './mongo/mongo-panel-configuration-repository'
import { StatusMessageRepository } from './interfaces/status-message-repository'
import { InMemoryStatusMessageRepository } from './in-memory/in-memory-status-message-repository'

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

  public static createPanelConfigurationRepository(): PanelConfigurationRepository {
    return new MongoPanelConfigurationRepository(this.createMongoDatabase(), this.createUuidGenerator())
  }

  private static createUuidGenerator(): UuidGenerator {
    return new CryptoUuidGenerator()
  }

  public static createStatusMessageRepository(): StatusMessageRepository {
    return InMemoryStatusMessageRepository.getInstance()
  }
}
