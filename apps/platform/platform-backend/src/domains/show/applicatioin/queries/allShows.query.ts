import { Query, QueryHandler } from "@marginal.credit/backend-framework";

import type { Show } from "../../domain/show";
import type { Actor } from "../../../auth/domain/actor";
import type { ShowStore } from "../show.store";

export class AllShowsQuery extends Query<Show[]> {
  constructor(
    readonly payload: {
      actor: Actor;
    },
  ) {
    super();
  }
}

export class AllShowsQueryHandler extends QueryHandler(AllShowsQuery) {
  constructor(private readonly showStore: ShowStore) {
    super();
  }

  async execute() {
    return this.showStore.loadAll();
  }
}
