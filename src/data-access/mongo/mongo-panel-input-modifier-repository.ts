import { BaseMongoRepository } from './base-mongo-repository'
import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'
import { PanelInputModifierRepository } from '../interfaces/panel-input-modifier-repository'
import { MongoDatabase, MongoId } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'

const PANEL_INPUT_MODIFIER_COLLECTION_NAME: string = 'panelInputModifiers'

interface MongoPanelInputModifier extends PanelInputModifier, MongoId {}

export class MongoPanelInputModifierRepository extends BaseMongoRepository<MongoPanelInputModifier> implements PanelInputModifierRepository {
  public constructor(mongoDatabase: MongoDatabase, private readonly uuidGenerator: UuidGenerator) {
    super(mongoDatabase)
  }

  protected override getCollectionName(): string {
    return PANEL_INPUT_MODIFIER_COLLECTION_NAME
  }

  public getPanelInputModifiers(): Promise<PanelInputModifier[]> {
    this.assertDatabaseConnection(this.getPanelInputModifiers.name)
    return this.getCollection().find<PanelInputModifier>({}).toArray()
  }

  public async createPanelInputModifier(panelInputModifierWithoutId: Omit<PanelInputModifier, 'id'>): Promise<PanelInputModifier> {
    this.assertDatabaseConnection(this.createPanelInputModifier.name)
    const panelInputModifier: PanelInputModifier = {
      ...panelInputModifierWithoutId,
      id: this.uuidGenerator.generateUuid()
    }
    await this.getCollection().updateOne({ id: panelInputModifier.id }, { $set: panelInputModifier }, { upsert: true })
    return panelInputModifier
  }

  public async deletedPanelInputModifier(panelInputModifierId: string): Promise<void> {
    this.assertDatabaseConnection(this.deletedPanelInputModifier.name)
    await this.getCollection().deleteOne({ id: panelInputModifierId })
  }
}
