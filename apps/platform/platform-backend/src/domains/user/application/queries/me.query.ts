import {
  ApplicationError,
  Query,
  QueryHandler,
} from "@marginal.credit/backend-framework";

import { User } from "../../domain/user";
import type { Actor } from "../../../auth/domain/actor";
import type { UserStore } from "../user.store";

export class MeQuery extends Query<User> {
  constructor(
    readonly payload: {
      actor: Actor;
    },
  ) {
    super();
  }
}

export class MeQueryHandler extends QueryHandler(MeQuery) {
  constructor(private readonly userStore: UserStore) {
    super();
  }

  async execute(query: MeQuery) {
    const { actor } = query.payload;

    const user = await this.userStore.load(actor.id);

    if (!user) {
      throw ApplicationError.notFound(User, actor.id);
    }

    return user;
  }
}
