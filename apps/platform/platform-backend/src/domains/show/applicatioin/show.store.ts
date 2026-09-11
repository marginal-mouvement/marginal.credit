import type { Store } from "@marginal.credit/backend-framework";

import type { Show } from "../domain/show";

export interface ShowStore extends Store<Show> {
  loadAll(): Promise<Show[]>;
}
