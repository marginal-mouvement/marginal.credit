import type { ISerializer } from "@ddd-ts/core";
import { KeyId, UserId } from "@marginal.credit/backend-framework";

import { Key } from "../domain/key";
import { ShowId } from "../../show/domain/showId";

export class MongoKeySerializer implements ISerializer<Key> {
  serialize(value: Key) {
    return {
      version: 1,
      _id: value.id.serialize(),
      ownerId: value.ownerId?.serialize(),
      showId: value.showId?.serialize(),
      assignedAt: value.assignedAt,
    };
  }

  deserialize(value: ReturnType<typeof this.serialize>) {
    return new Key({
      id: KeyId.deserialize(value._id),
      ownerId: value.ownerId ? UserId.deserialize(value.ownerId) : undefined,
      showId: value.showId ? ShowId.deserialize(value.showId) : undefined,
      assignedAt: value.assignedAt,
    });
  }
}
