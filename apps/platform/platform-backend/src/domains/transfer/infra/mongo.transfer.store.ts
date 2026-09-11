import type { UserId } from "@marginal.credit/backend-framework";
import { MongoStore } from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoTransferSerializer } from "./mongo.transfer.serializer";

import type { Transfer } from "../domain/transfer";
import type { TransferStore } from "../application/transfer.store";

export class MongoTransferStore
  extends MongoStore<Transfer>
  implements TransferStore
{
  constructor(db: Db) {
    super(db, "transfer", new MongoTransferSerializer());
  }

  async loadAllForUser(userId: UserId) {
    return this.find({ userId: userId.serialize() }, { date: "desc" });
  }
}
