import type {
  HonoRouter,
  InMemoryIntentBus,
} from "@marginal.credit/backend-framework";
import { TransferApi } from "@marginal.credit/platform-sdk";

import type { Actor } from "../../auth/domain/actor";
import { AllMyTransfersQuery } from "../application/queries/allMyTransfers.query";
import { HttpTransferSerializer } from "../infra/http.transfer.serializer";

export function bootTransferRoutes(
  router: HonoRouter<Actor>,
  intentBus: InMemoryIntentBus,
) {
  const transferPresenter = new HttpTransferSerializer();

  router.routeWithAuth(TransferApi.AllMines, async (_, actor) => {
    const transfers = await intentBus.handle(
      new AllMyTransfersQuery({
        actor,
      }),
    );

    return transferPresenter.serializeTransfers(transfers);
  });
}
