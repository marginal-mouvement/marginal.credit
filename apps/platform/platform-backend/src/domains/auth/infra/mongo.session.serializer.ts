import type { ISerializer } from "@ddd-ts/core";
import { UserId } from "@marginal.credit/backend-framework";

import { Session } from "../domain/session";
import { SessionId } from "../domain/sessionId";
import { Permission } from "../domain/permission";

export class MongoSessionSerializer implements ISerializer<Session> {
  serialize(value: Session) {
    return {
      version: 1,
      _id: value.id.serialize(),
      userId: value.userId?.serialize(),
      permission: value.permission.serialize(),
      expiresAt: value.expiresAt,
      revokedAt: value.revokedAt,
      createdAt: value.createdAt,
      lastUsedAt: value.lastUsedAt,
    };
  }

  deserialize(serialized: ReturnType<typeof this.serialize>) {
    return new Session({
      id: SessionId.deserialize(serialized._id),
      userId: serialized.userId
        ? UserId.deserialize(serialized.userId)
        : undefined,
      permission: Permission.deserialize(serialized.permission),
      expiresAt: serialized.expiresAt,
      revokedAt: serialized.revokedAt,
      createdAt: serialized.createdAt,
      lastUsedAt: serialized.lastUsedAt,
    });
  }
}
