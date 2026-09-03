import { DomainError, KeyId, UserId } from "@marginal.credit/backend-framework";
import { Optional, Shape } from "@ddd-ts/shape";

import { ShowId } from "../../show/domain/showId";

export class Key extends Shape({
  id: KeyId,
  ownerId: Optional(UserId),
  showId: Optional(ShowId),
  assignedAt: Optional(Date),
}) {
  static create(showId?: ShowId) {
    return new Key({
      id: KeyId.generate(),
      ownerId: undefined,
      showId: showId,
      assignedAt: undefined,
    });
  }

  isAvailable() {
    return this.ownerId === undefined;
  }

  assign(ownerId: UserId, at: Date) {
    if (this.ownerId) {
      throw DomainError.conflict("Key already claimed");
    }

    this.ownerId = ownerId;
    this.assignedAt = at;
  }
}
