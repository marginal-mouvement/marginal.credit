import type {
  InMemoryDatabase,
  InMemoryTransaction,
} from "@ddd-ts/store-inmemory";
import { InMemoryStore } from "@ddd-ts/store-inmemory";
import { DispatchingStore } from "@marginal.credit/backend-framework";

import { MongoUserSerializer } from "./mongo.user.serializer";

import type { User } from "../domain/user";
import type { UserStore } from "../application/user.store";

export class InMemoryUserStore
  extends DispatchingStore(InMemoryStore<User>)
  implements UserStore
{
  constructor(db: InMemoryDatabase) {
    super("user", db, new MongoUserSerializer());
  }

  async loadByName(name: string, transaction?: InMemoryTransaction) {
    return (await this.filter((user) => user.name === name, transaction))[0];
  }
}
