import type { IIdentifiable } from "@ddd-ts/core";
import type { Db, Filter, SortDirection } from "mongodb";

import type { MongoTransaction } from "./mongo.transaction";

import type { Serializer, Store } from "../../core";

export class MongoStore<T extends IIdentifiable> implements Store<T> {
  constructor(
    private readonly db: Db,
    private readonly collectionName: string,
    private readonly serializer: Serializer<T, { _id: string }>,
  ) {}

  get collection() {
    return this.db.collection<{ _id: string }>(this.collectionName);
  }

  async find(
    query?: Filter<{ _id: string }>,
    sort?: Record<string, SortDirection>,
  ) {
    const docs = await this.collection
      .find(query ?? {})
      .sort({ ...(sort ?? {}) })
      .toArray();

    return docs.map(this.serializer.deserialize);
  }

  async findOne(
    query: Filter<{ _id: string }>,
    transaction?: MongoTransaction,
  ) {
    const doc = await this.collection.findOne(query, {
      session: transaction?.session,
    });

    return doc ? this.serializer.deserialize(doc) : undefined;
  }

  async load(id: T["id"], transaction?: MongoTransaction) {
    return this.findOne({ _id: id.serialize() }, transaction);
  }

  async save(entity: T, transaction?: MongoTransaction) {
    const { _id, ...rest } = this.serializer.serialize(entity);

    await this.collection.updateOne(
      {
        _id,
      },
      {
        $set: rest,
      },
      { upsert: true, session: transaction?.session },
    );
  }
}
