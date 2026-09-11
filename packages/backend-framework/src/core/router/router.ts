import type {
  AnyContractWithAuth,
  AnyContractWithoutAuth,
  PayloadOf,
  ResultOf,
} from "@marginal.credit/sdk";

import type { UserId } from "../value";

export interface IActor {
  id: UserId;
}

export interface Router<ActorImpl extends IActor> {
  routeWithoutAuth<Contract extends AnyContractWithoutAuth>(
    contract: Contract,
    handle: (payload: PayloadOf<Contract>) => Promise<ResultOf<Contract>>,
  ): void;
  routeWithAuth<Contract extends AnyContractWithAuth>(
    contract: Contract,
    handle: (
      payload: PayloadOf<Contract>,
      actor: ActorImpl,
    ) => Promise<ResultOf<Contract>>,
  ): void;
}
