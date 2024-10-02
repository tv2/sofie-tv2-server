import { BaseMongoRepository } from './base-mongo-repository'
import { PanelLayoutConfigurationRepository } from '../interfaces/panel-layout-configuration-repository'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { MongoDatabase } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'

const PANEL_LAYOUT_CONFIGURATION_COLLECTION_NAME: string = 'panelLayoutConfigurations'

export class MongoPanelLayoutConfigurationRepository extends BaseMongoRepository implements PanelLayoutConfigurationRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return PANEL_LAYOUT_CONFIGURATION_COLLECTION_NAME
  }

  public getPanelLayoutConfiguration(_panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration> {
    throw new Error('Not implemented')
  }

  public getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]> {
    throw new Error('Not implemented')
  }

  public async createPanelLayoutConfiguration(panelLayoutConfiguration: Omit<PanelLayoutConfiguration, 'id'>): Promise<PanelLayoutConfiguration> {
    this.assertDatabaseConnection(this.createPanelLayoutConfiguration.name)
    const panelLayoutConfigurationToBeInserted: PanelLayoutConfiguration = {
      ...panelLayoutConfiguration,
      id: this.uuidGenerator.generateUuid(),
    }
    await this.getCollection().updateOne({ _id: panelLayoutConfigurationToBeInserted.id }, { $set: panelLayoutConfigurationToBeInserted }, { upsert: true })
    return panelLayoutConfigurationToBeInserted
  }
}
