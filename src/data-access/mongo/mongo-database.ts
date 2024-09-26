import { Collection, Db, MongoClient } from 'mongodb'
import { Database } from '../interfaces/database'
import { Logger } from '../../logger/logger'
import { DatabaseNotConnectedException } from '../../model/exceptions/database-not-connected-exception'

export interface MongoId {
  _id: string
}

const MONGO_CONNECTION_STRING: string = process.env.MONGO_URL ?? 'mongodb://localhost:3001'
const MONGO_DB_NAME: string = getMongoDatabaseName()

function getMongoDatabaseName(): string {
  const mongoUrlPattern: RegExp = /^mongodb:\/\/(\w+|\d+\.\d+\.\d+\.\d+)(:\d+)?\/(?<databaseName>[^/?]+)/i
  return mongoUrlPattern.exec(MONGO_CONNECTION_STRING)?.groups?.databaseName ?? 'alba-tv2-server'
}

export class MongoDatabase implements Database {
  private static instance: MongoDatabase

  public static getInstance(logger: Logger): MongoDatabase {
    if (!this.instance) {
      this.instance = new MongoDatabase(logger)
    }
    return this.instance
  }

  private readonly logger: Logger
  private client?: MongoClient
  private db?: Db

  private constructor(logger: Logger) {
    this.logger = logger.tag(MongoDatabase.name)
  }

  public async connect(): Promise<void> {
    await this.connectToMongoDatabase()
  }

  private async connectToMongoDatabase(): Promise<void> {
    if (this.db) {
      this.logger.info('Already connected to database. Skipping reconnection...')
      return
    }

    this.client = new MongoClient(MONGO_CONNECTION_STRING)
    await this.client.connect()

    this.db = this.client.db(MONGO_DB_NAME)
    this.logger.info(`Connected to database: ${this.db.databaseName}`)
  }

  public getCollection<Model extends MongoId>(collectionName: string): Collection<Model> {
    this.assertDatabaseConnection(this.db)
    return this.db.collection(collectionName)
  }

  private assertDatabaseConnection(database?: Db): asserts database is NonNullable<Db> {
    if (!database) {
      throw new DatabaseNotConnectedException('Not connected to the database')
    }
  }

  public getDatabaseName(): string {
    return MONGO_DB_NAME
  }
}
