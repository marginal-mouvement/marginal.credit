import { MongoStore } from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoShowSerializer } from "./mongo.show.serializer";

import type { Show } from "../domain/show";
import type { ShowStore } from "../applicatioin/show.store";

export class MongoShowStore extends MongoStore<Show> implements ShowStore {
  constructor(db: Db) {
    super(db, "show", new MongoShowSerializer());
  }

  async loadAll() {
    return this.find();
  }
}
