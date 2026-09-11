import { EsAggregate, EsEvent, On } from "@ddd-ts/core";
import { Optional } from "@ddd-ts/shape";
import { DomainError, UserId } from "@marginal.credit/backend-framework";

import { SessionId } from "./sessionId";
import { Permission } from "./permission";

export class SessionCreated extends EsEvent("SessionCreated", {
  id: SessionId,
  userId: Optional(UserId),
  permission: Permission,
  expiresAt: Optional(Date),
  at: Date,
}) {}

export class Session extends EsAggregate("Session", {
  events: [SessionCreated],
  state: {
    id: SessionId,
    userId: Optional(UserId),
    permission: Permission,
    expiresAt: Optional(Date),
    revokedAt: Optional(Date),
    createdAt: Date,
    lastUsedAt: Date,
  },
}) {
  static create(
    {
      expiresAt,
      permission,
      userId,
    }: {
      userId?: UserId;
      permission: Permission;
      expiresAt?: Date;
    },
    now: Date,
  ) {
    return this.new(
      SessionCreated.new({
        id: SessionId.generate(),
        userId,
        permission,
        expiresAt,
        at: now,
      }),
    );
  }

  @On(SessionCreated)
  static onSessionCreated(event: SessionCreated) {
    return new Session({
      id: event.payload.id,
      userId: event.payload.userId,
      permission: event.payload.permission,
      expiresAt: event.payload.expiresAt,
      createdAt: event.payload.at,
      lastUsedAt: event.payload.at,
      revokedAt: undefined,
    });
  }

  ensureIsUsable(now: Date) {
    if (this.expiresAt && this.expiresAt < now) {
      throw DomainError.forbidden("session expired");
    }

    if (this.revokedAt) {
      throw DomainError.forbidden("session revoked");
    }
  }
}
