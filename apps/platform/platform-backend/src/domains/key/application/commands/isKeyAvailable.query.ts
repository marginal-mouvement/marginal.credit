import type { KeyId } from "@marginal.credit/backend-framework";
import {
  ApplicationError,
  QueryHandler,
  Query,
} from "@marginal.credit/backend-framework";

import type { KeyStore } from "../key.store";
import { Key } from "../../domain/key";

export class IsKeyAvailableQuery extends Query<{ available: boolean }> {
  constructor(
    readonly payload: {
      keyId: KeyId;
    },
  ) {
    super();
  }
}

export class IsKeyAvailableQueryHandler extends QueryHandler(
  IsKeyAvailableQuery,
) {
  constructor(private readonly keyStore: KeyStore) {
    super();
  }

  async execute(query: IsKeyAvailableQuery) {
    const { keyId } = query.payload;

    const key = await this.keyStore.load(keyId);

    if (!key) {
      throw ApplicationError.notFound(Key, keyId);
    }

    return {
      available: key.isAvailable(),
    };
  }
}
