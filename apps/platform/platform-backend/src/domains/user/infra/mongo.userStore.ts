import type { MongoTransaction } from "@marginal.credit/backend-framework";
import {
  DispatchingStore,
  MongoStore,
} from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoUserSerializer } from "./mongo.user.serializer";

import type { User } from "../domain/user";
import type { UserStore } from "../application/user.store";

export class MongoUserStore
  extends DispatchingStore(MongoStore<User>)
  implements UserStore
{
  constructor(db: Db) {
    super(db, "user", new MongoUserSerializer());
  }

  async loadByName(name: string, transaction?: MongoTransaction) {
    return this.findOne({ name }, transaction);
  }
}
