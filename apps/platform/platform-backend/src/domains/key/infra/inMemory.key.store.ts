import type { InMemoryDatabase } from "@ddd-ts/store-inmemory";
import { InMemoryStore } from "@ddd-ts/store-inmemory";

import { MongoKeySerializer } from "./mongo.key.serializer";

import type { Key } from "../domain/key";
import type { KeyStore } from "../application/key.store";

export class InMemoryKeyStore extends InMemoryStore<Key> implements KeyStore {
  constructor(db: InMemoryDatabase) {
    super("key", db, new MongoKeySerializer());
  }
}
