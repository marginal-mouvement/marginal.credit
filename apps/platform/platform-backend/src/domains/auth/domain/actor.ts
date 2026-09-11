import { UserId } from "@marginal.credit/backend-framework";

import { Permission } from "./permission";

export class Actor {
  constructor(
    readonly id: UserId,
    readonly permission: Permission,
    private readonly authSource: "keyId" | "session" | "root",
  ) {}

  ensureIsAtLeastStation() {
    this.permission.ensureIsAtLeast(Permission.station());
  }

  ensureIsRoot() {
    this.permission.ensureIsAtLeast(Permission.root());
  }

  static root() {
    return new Actor(UserId.root(), Permission.root(), "root");
  }

  static generate(permission: Permission) {
    return new Actor(UserId.generate(), permission, "session");
  }
}
