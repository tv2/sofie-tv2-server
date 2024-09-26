import { BaseMongoRepository } from './base-mongo-repository'
import { ConfiguredPanelLayoutRepository } from '../interfaces/configured-panel-layout-repository'
import { ConfiguredPanelLayout } from '../../model/interfaces/configured-panel-layout'
import { MongoDatabase } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'

const CONFIGURED_PANEL_LAYOUT_COLLECTION_NAME: string = 'configuredPanelLayouts'

export class MongoConfiguredPanelLayoutRepository extends BaseMongoRepository implements ConfiguredPanelLayoutRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return CONFIGURED_PANEL_LAYOUT_COLLECTION_NAME
  }

  public getConfiguredPanelLayout(_configuredPanelLayoutId: string): Promise<ConfiguredPanelLayout> {
    throw new Error('Not implemented')
  }

  public getConfiguredPanelLayouts(): Promise<ConfiguredPanelLayout[]> {
    throw new Error('Not implemented')
  }

  public async createConfiguredPanelLayout(configuredPanelLayout: Omit<ConfiguredPanelLayout, 'id'>): Promise<ConfiguredPanelLayout> {
    this.assertDatabaseConnection(this.createConfiguredPanelLayout.name)
    const configuredPanelLayoutToBeInserted: ConfiguredPanelLayout = {
      ...configuredPanelLayout,
      id: this.uuidGenerator.generateUuid(),
    }
    await this.getCollection().updateOne({ _id: configuredPanelLayoutToBeInserted.id }, { $set: configuredPanelLayoutToBeInserted }, { upsert: true })
    return configuredPanelLayoutToBeInserted
  }
}
