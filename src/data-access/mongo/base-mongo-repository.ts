import { DatabaseNotConnectedException } from '../../model/exceptions/database-not-connected-exception'
import { Collection } from 'mongodb'
import { MongoDatabase, MongoId } from './mongo-database'

export abstract class BaseMongoRepository {
  protected constructor(protected mongoDatabase: MongoDatabase) {}

  protected abstract getCollectionName(): string

  protected getCollection<Model extends MongoId>(): Collection<Model> {
    return this.mongoDatabase.getCollection(this.getCollectionName())
  }

  protected assertDatabaseConnection(queryName: string): void {
    if (!this.getCollection()) {
      throw new DatabaseNotConnectedException(
        `Unable to perform query: ${queryName} - not connected to database.collection: ${this.mongoDatabase.getDatabaseName()}.${this.getCollectionName()}`,
      )
    }
  }
}
