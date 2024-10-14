import { BaseMongoRepository } from './base-mongo-repository'
import { PanelLayoutConfigurationRepository } from '../interfaces/panel-layout-configuration-repository'
import { PanelLayoutConfiguration } from '../../model/interfaces/panel-layout-configuration'
import { MongoDatabase } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'
import { NotFoundException } from '../../model/exceptions/not-found-exception'

const PANEL_LAYOUT_CONFIGURATION_COLLECTION_NAME: string = 'panelLayoutConfigurations'

export class MongoPanelLayoutConfigurationRepository extends BaseMongoRepository implements PanelLayoutConfigurationRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return PANEL_LAYOUT_CONFIGURATION_COLLECTION_NAME
  }

  public async getPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelLayoutConfiguration> {
    this.assertDatabaseConnection(this.getPanelLayoutConfiguration.name)
    const panelLayoutConfiguration: PanelLayoutConfiguration | null = await this.getCollection().findOne<PanelLayoutConfiguration>({
      id: panelLayoutConfigurationId,
    })
    if (!panelLayoutConfiguration) {
      throw new NotFoundException(`No PanelLayoutConfiguration found in database for: ${panelLayoutConfigurationId}`)
    }
    return panelLayoutConfiguration
  }

  public async getPanelLayoutConfigurations(): Promise<PanelLayoutConfiguration[]> {
    this.assertDatabaseConnection(this.getPanelLayoutConfigurations.name)
    return await this.getCollection().find<PanelLayoutConfiguration>({}).toArray()
  }

  public async createPanelLayoutConfiguration(panelLayoutConfiguration: Omit<PanelLayoutConfiguration, 'id'>): Promise<PanelLayoutConfiguration> {
    this.assertDatabaseConnection(this.createPanelLayoutConfiguration.name)
    const panelLayoutConfigurationToBeInserted: PanelLayoutConfiguration = {
      ...panelLayoutConfiguration,
      id: this.uuidGenerator.generateUuid()
    }
    await this.getCollection().updateOne({ _id: panelLayoutConfigurationToBeInserted.id }, { $set: panelLayoutConfigurationToBeInserted }, { upsert: true })
    return panelLayoutConfigurationToBeInserted
  }

  public async deletePanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<void> {
    this.assertDatabaseConnection(this.deletePanelLayoutConfiguration.name)
    await this.getCollection().deleteOne({ id: panelLayoutConfigurationId })
  }
}
