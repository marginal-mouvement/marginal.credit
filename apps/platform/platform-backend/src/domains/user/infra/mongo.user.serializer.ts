import type { ISerializer } from "@ddd-ts/core";
import { UserId } from "@marginal.credit/backend-framework";

import { User } from "../domain/user";
import { Email } from "../domain/email";
import { ShowId } from "../../show/domain/showId";

export class MongoUserSerializer implements ISerializer<User> {
  serialize(value: User) {
    return {
      version: 1,
      _id: value.id.serialize(),
      name: value.name,
      email: value.email.serialize(),
      balance: value.balance,
      visitedShows: value.visitedShows.map((show) => show.serialize()),
      emailConfirmed: value.emailConfirmed,
      createdAt: value.createdAt,
    };
  }

  deserialize(value: ReturnType<typeof this.serialize>) {
    return new User({
      id: UserId.deserialize(value._id),
      name: value.name,
      email: Email.deserialize(value.email),
      balance: value.balance,
      visitedShows: value.visitedShows.map((showId) =>
        ShowId.deserialize(showId),
      ),
      emailConfirmed: value.emailConfirmed,
      createdAt: value.createdAt,
    });
  }
}
