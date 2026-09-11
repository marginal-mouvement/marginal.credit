import { Query, QueryHandler } from "@marginal.credit/backend-framework";

import type { Transfer } from "../../domain/transfer";
import type { Actor } from "../../../auth/domain/actor";
import type { TransferStore } from "../transfer.store";

export class AllMyTransfersQuery extends Query<Transfer[]> {
  constructor(
    readonly payload: {
      actor: Actor;
    },
  ) {
    super();
  }
}

export class AllMyTransfersQueryHandler extends QueryHandler(
  AllMyTransfersQuery,
) {
  constructor(private readonly transferStore: TransferStore) {
    super();
  }

  async execute(query: AllMyTransfersQuery) {
    const { actor } = query.payload;

    return await this.transferStore.loadAllForUser(actor.id);
  }
}
