import { Primitive } from "@ddd-ts/shape";
import { ApplicationError } from "@marginal.credit/backend-framework";

const Grade = {
  Basic: 0,
  Admin: 1,
  Station: 2,
  Root: 3,
} as const;

// eslint-disable-next-line ts/no-redeclare
type Grade = (typeof Grade)[keyof typeof Grade];

const GradeName = {
  [Grade.Basic]: "Basic",
  [Grade.Admin]: "Admin",
  [Grade.Station]: "Station",
  [Grade.Root]: "Root",
} as const satisfies Record<Grade, string>;

export class Permission extends Primitive(Number) {
  isAtLeast(other: Permission) {
    return this.value >= other.serialize();
  }

  ensureIsAtLeast(other: Permission) {
    if (!this.isAtLeast(other)) {
      throw ApplicationError.forbidden(
        GradeName[other.serialize() as Grade],
        GradeName[this.value as Grade],
      );
    }
  }

  static basic() {
    return new Permission(Grade.Basic);
  }

  static station() {
    return new Permission(Grade.Station);
  }

  static root() {
    return new Permission(Grade.Root);
  }
}
