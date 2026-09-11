import type { ISerializer } from "@ddd-ts/core";
import { UserId } from "@marginal.credit/backend-framework";

import { Transfer } from "../domain/transfer";
import { TransferId } from "../domain/transferId";

export class MongoTransferSerializer implements ISerializer<Transfer> {
  serialize(value: Transfer) {
    return {
      version: 1,
      _id: value.id.serialize(),
      userId: value.userId.serialize(),
      label: value.label,
      thumbnailUrl: value.thumbnailUrl,
      amount: value.amount,
      kind: value.kind,
      date: value.date,
    };
  }

  deserialize(value: ReturnType<typeof this.serialize>) {
    return new Transfer({
      id: TransferId.deserialize(value._id),
      userId: UserId.deserialize(value.userId),
      label: value.label,
      thumbnailUrl: value.thumbnailUrl,
      amount: value.amount,
      kind: value.kind,
      date: value.date,
    });
  }
}
