import { PanelConfigurationRepository } from '../interfaces/panel-configuration-repository'
import { BaseMongoRepository } from './base-mongo-repository'
import { MongoDatabase } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'

const PANEL_CONFIGURATION_COLLECTION_NAME: string = 'panelConfigurations'

export class MongoPanelConfigurationRepository extends BaseMongoRepository implements PanelConfigurationRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return PANEL_CONFIGURATION_COLLECTION_NAME
  }

  public async createPanelConfiguration(panelConfigurationWithoutId: Omit<PanelConfiguration, 'id'>): Promise<PanelConfiguration> {
    this.assertDatabaseConnection(this.createPanelConfiguration.name)
    const panelConfigurationToBeInserted: PanelConfiguration = {
      ...panelConfigurationWithoutId,
      id: this.uuidGenerator.generateUuid()
    }
    await this.getCollection().updateOne({ id: panelConfigurationToBeInserted.id }, { $set: panelConfigurationToBeInserted }, { upsert: true })
    return panelConfigurationToBeInserted
  }
}
