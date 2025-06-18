import { MongoPanelInputModifierRepository } from '../mongo-panel-input-modifier-repository'
import { MongoDatabase, MongoId } from '../mongo-database'
import { Collection, Filter } from 'mongodb'
import { UuidGenerator } from '../../interfaces/uuid-generator'
import { anything, capture, instance, mock, when } from '@typestrong/ts-mockito'
import { PanelInputModifier } from '../../../model/interfaces/panel-input-modifier'
import { EntityTestFactory } from '../../../model/test/entity-test-factory'
import { InvalidIdException } from '../../../model/exceptions/invalid-id-exception'

const UUID: string = 'random-uuid'

describe(MongoPanelInputModifierRepository.name, () => {
  describe(MongoPanelInputModifierRepository.prototype.createPanelInputModifier.name, () => {
    let uuidGenerator: UuidGenerator
    let collection: Collection<MongoId>

    beforeEach(() => {
      uuidGenerator = mock<UuidGenerator>()
      when(uuidGenerator.generateUuid()).thenReturn(UUID)

      collection = mock(Collection<MongoId>)
    })

    describe('it receives a Modifier with no id', () => {
      describe('the id is undefined', () => {
        it('creates the Modifier with a new UUID', async () => {
          const modifier: PanelInputModifier = EntityTestFactory.createPanelInputModifier({ id: undefined })

          const testee: MongoPanelInputModifierRepository = createTestee({ collection: instance(collection), uuidGenerator: instance(uuidGenerator) })
          await testee.createPanelInputModifier(modifier)

          const [filter] = capture(collection.updateOne).last()
          const result: Filter<PanelInputModifier> = filter as unknown as Filter<PanelInputModifier>

          expect(result.id).toBe(UUID)
        })
      })

      describe('the id is an empty string', () => {
        it('creates the Modifier with a new UUID', async () => {
          const modifier: PanelInputModifier = EntityTestFactory.createPanelInputModifier({ id: '' })

          const testee: MongoPanelInputModifierRepository = createTestee({ collection: instance(collection), uuidGenerator: instance(uuidGenerator) })
          await testee.createPanelInputModifier(modifier)

          const [filter] = capture(collection.updateOne).last()
          const result: Filter<PanelInputModifier> = filter as unknown as Filter<PanelInputModifier>

          expect(result.id).toBe(UUID)
        })
      })
    })

    describe('it receives a Modifier with a pre-existing id', () => {
      describe('the id is not a valid UUID', () => {
        it('throws an InvalidIdException', () => {
          const modifier: PanelInputModifier = EntityTestFactory.createPanelInputModifier({ id: 'invalid-uuid' })
          when(uuidGenerator.validateUuid(modifier.id)).thenReturn(false)

          const testee: MongoPanelInputModifierRepository = createTestee({ collection: instance(collection), uuidGenerator: instance(uuidGenerator) })

          expect(() => testee.createPanelInputModifier(modifier)).rejects.toThrow(InvalidIdException)
        })
      })

      describe('the id is a valid UUID', () => {
        const validUuid: string = 'valid-uuid'

        beforeEach(() => {
          when(uuidGenerator.validateUuid(validUuid)).thenReturn(true)
        })

        it('creates the Modifier with the pre-existing id', async () => {
          const modifier: PanelInputModifier = EntityTestFactory.createPanelInputModifier({ id: validUuid })

          const testee: MongoPanelInputModifierRepository = createTestee({ collection: instance(collection), uuidGenerator: instance(uuidGenerator) })
          await testee.createPanelInputModifier(modifier)

          const [filter] = capture(collection.updateOne).last()
          const result: Filter<PanelInputModifier> = filter as unknown as Filter<PanelInputModifier>

          expect(result.id).toBe(validUuid)
        })

        describe('a Modifier already exist with the UUID', () => {
          it('throws an InvalidIdException', () => {
            const modifier: PanelInputModifier = EntityTestFactory.createPanelInputModifier({ id: validUuid })
            when(collection.countDocuments(anything())).thenReturn(Promise.resolve(1))

            const testee: MongoPanelInputModifierRepository = createTestee({ collection: instance(collection), uuidGenerator: instance(uuidGenerator) })

            expect(() => testee.createPanelInputModifier(modifier)).rejects.toThrow(InvalidIdException)
          })
        })
      })
    })
  })
})

function createTestee(params?: {
  mongoDatabase?: MongoDatabase
  collection?: Collection<MongoId>
  uuidGenerator?: UuidGenerator
}): MongoPanelInputModifierRepository {
  return new MongoPanelInputModifierRepository(
    params?.mongoDatabase ?? getMockDatabase({ collection: params?.collection }),
    params?.uuidGenerator ?? instance(mock<UuidGenerator>())
  )
}

function getMockDatabase(params?: {
  collection?: Collection<MongoId>
}): MongoDatabase {
  const mockDatabase: MongoDatabase = mock(MongoDatabase)
  when(mockDatabase.getCollection(anything())).thenReturn(params?.collection ?? instance(mock(Collection<MongoId>)))
  return instance(mockDatabase)
}
