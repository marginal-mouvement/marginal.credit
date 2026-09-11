import type { KeyId } from "@marginal.credit/backend-framework";
import {
  ApplicationError,
  QueryHandler,
  Query,
} from "@marginal.credit/backend-framework";

import type { KeyStore } from "../../../key/application/key.store";
import { User } from "../../domain/user";
import type { Actor } from "../../../auth/domain/actor";
import type { UserStore } from "../user.store";
import { Key } from "../../../key/domain/key";

export class UserByKeyQuery extends Query<User> {
  constructor(
    readonly payload: {
      actor: Actor;
      keyId: KeyId;
    },
  ) {
    super();
  }
}

export class UserByKeyQueryHandler extends QueryHandler(UserByKeyQuery) {
  constructor(
    private readonly keyStore: KeyStore,
    private readonly userStore: UserStore,
  ) {
    super();
  }

  async execute(query: UserByKeyQuery) {
    const { keyId, actor } = query.payload;

    actor.ensureIsAtLeastStation();

    const key = await this.keyStore.load(keyId);

    if (!key) {
      throw ApplicationError.notFound(Key, keyId);
    }

    if (!key.ownerId) {
      throw ApplicationError.notFound(User, keyId);
    }

    const user = await this.userStore.load(key.ownerId);

    if (!user) {
      throw ApplicationError.notFound(User, key.ownerId);
    }

    return user;
  }
}
