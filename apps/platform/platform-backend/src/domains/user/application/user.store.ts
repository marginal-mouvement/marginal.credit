import type { Store, Transaction } from "@marginal.credit/backend-framework";

import type { User } from "../domain/user";

export interface UserStore extends Store<User> {
  loadByName(
    name: string,
    transaction?: Transaction,
  ): Promise<User | undefined>;
}
