import { MongoStore } from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoKeySerializer } from "./mongo.key.serializer";

import type { Key } from "../domain/key";

export class MongoKeyStore extends MongoStore<Key> {
  constructor(db: Db) {
    super(db, "key", new MongoKeySerializer());
  }
}
