import { BaseMongoRepository } from './base-mongo-repository'
import { ConfiguredPanelLayoutRepository } from '../interfaces/configured-panel-layout-repository'
import { ConfiguredPanelLayout } from '../../model/interfaces/configured-panel-layout'
import { MongoDatabase } from './mongo-database'
import { PanelType, SkaarhojModel } from '../../model/enums/panel-enums'

const CONFIGURED_PANEL_LAYOUT_COLLECTION_NAME: string = 'configuredPanelLayouts'

export class MongoConfiguredPanelLayoutRepository extends BaseMongoRepository implements ConfiguredPanelLayoutRepository {
  public constructor(mongoDatabase: MongoDatabase) {
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

  public async createConfiguredPanelLayout(_configuredPanelLayout: Omit<ConfiguredPanelLayout, 'id'>): Promise<ConfiguredPanelLayout> {
    this.assertDatabaseConnection(this.createConfiguredPanelLayout.name)
    const dummy: ConfiguredPanelLayout = {
      id: 'dummyId',
      name: 'dummyName',
      type: PanelType.SKAARHOJ,
      model: SkaarhojModel.MKT1A,
    }
    await this.getCollection().updateOne({ id: dummy.id }, { $set: dummy }, { upsert: true })
    return dummy
  }
}
