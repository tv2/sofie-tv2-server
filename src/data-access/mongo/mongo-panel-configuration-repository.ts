import { PanelConfigurationRepository } from '../interfaces/panel-configuration-repository'
import { BaseMongoRepository } from './base-mongo-repository'
import { MongoDatabase, MongoId } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'
import { PanelConfiguration } from '../../model/interfaces/panel-configuration'
import { NotFoundException } from '../../model/exceptions/not-found-exception'

const PANEL_CONFIGURATION_COLLECTION_NAME: string = 'panelConfigurations'

interface MongoPanelConfiguration extends PanelConfiguration, MongoId {}

export class MongoPanelConfigurationRepository extends BaseMongoRepository<MongoPanelConfiguration> implements PanelConfigurationRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return PANEL_CONFIGURATION_COLLECTION_NAME
  }

  public async getPanelConfiguration(panelConfigurationId: string): Promise<PanelConfiguration> {
    this.assertDatabaseConnection(this.getPanelConfiguration.name)
    const panelConfiguration: PanelConfiguration | null = await this.getCollection().findOne({ id: panelConfigurationId })
    if (!panelConfiguration) {
      throw new NotFoundException(`No PanelConfiguration found in database for: ${panelConfigurationId}`)
    }
    return panelConfiguration
  }

  public getPanelConfigurations(): Promise<PanelConfiguration[]> {
    this.assertDatabaseConnection(this.getPanelConfigurations.name)
    return this.getCollection().find<PanelConfiguration>({}).toArray()
  }

  public async getPanelConfigurationsForPanelLayoutConfiguration(panelLayoutConfigurationId: string): Promise<PanelConfiguration[]> {
    this.assertDatabaseConnection(this.getPanelConfigurationsForPanelLayoutConfiguration.name)
    return this.getCollection().find({ panelLayoutConfigurationId: panelLayoutConfigurationId }).toArray()
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

  public async updatePanelConfiguration(panelConfiguration: PanelConfiguration): Promise<void> {
    this.assertDatabaseConnection(this.updatePanelConfiguration.name)
    await this.getCollection().updateOne({ id: panelConfiguration.id }, { $set: panelConfiguration })
  }

  public async deletePanelConfiguration(panelConfigurationId: string): Promise<void> {
    this.assertDatabaseConnection(this.deletePanelConfiguration.name)
    await this.getCollection().deleteOne({ id: panelConfigurationId })
  }
}
