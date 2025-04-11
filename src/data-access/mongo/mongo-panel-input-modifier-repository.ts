import { BaseMongoRepository } from './base-mongo-repository'
import { PanelInputModifier } from '../../model/interfaces/panel-input-modifier'
import { PanelInputModifierRepository } from '../interfaces/panel-input-modifier-repository'
import { MongoDatabase, MongoId } from './mongo-database'
import { UuidGenerator } from '../interfaces/uuid-generator'
import { InvalidIdException } from '../../model/exceptions/invalid-id-exception'

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

  public async createPanelInputModifier(panelInputModifier: PanelInputModifier): Promise<PanelInputModifier> {
    this.assertDatabaseConnection(this.createPanelInputModifier.name)

    if (panelInputModifier.id && !this.uuidGenerator.validateUuid(panelInputModifier.id)) {
      throw new InvalidIdException(`"${panelInputModifier.id}" is not a valid UUID`)
    }

    const doesModifierAlreadyExist: boolean = await this.getCollection().countDocuments({ id: panelInputModifier.id }) > 0
    if (doesModifierAlreadyExist) {
      throw new InvalidIdException(`"${panelInputModifier.id}" already exist on a PanelInputModifier`)
    }

    const panelInputModifierToBeSaved: PanelInputModifier = {
      ...panelInputModifier,
      id: panelInputModifier.id && panelInputModifier.id.length > 0 ? panelInputModifier.id : this.uuidGenerator.generateUuid()
    }
    await this.getCollection().updateOne({ id: panelInputModifierToBeSaved.id }, { $set: panelInputModifierToBeSaved }, { upsert: true })
    return panelInputModifierToBeSaved
  }

  public async deletedPanelInputModifier(panelInputModifierId: string): Promise<void> {
    this.assertDatabaseConnection(this.deletedPanelInputModifier.name)
    await this.getCollection().deleteOne({ id: panelInputModifierId })
  }
}
