import type { IntentBus } from "@marginal.credit/backend-framework";
import { ApplicationError, Saga } from "@marginal.credit/backend-framework";

import { CreditUserBalanceCommand } from "./commands/creditUserBalance.command";

import { UserCreated } from "../domain/user";
import { Actor } from "../../auth/domain/actor";
import type { ShowStore } from "../../show/applicatioin/show.store";
import { Show } from "../../show/domain/show";

export class UserSaga extends Saga {
  constructor(
    private readonly intentBus: IntentBus,
    private readonly showStore: ShowStore,
  ) {
    super();
  }

  @Saga.on(UserCreated)
  async onUserCreated(event: UserCreated) {
    const { referrerId, id, name, duringShow, referrerName } = event.payload;

    if (referrerId) {
      await Promise.all([
        this.intentBus.handle(
          new CreditUserBalanceCommand({
            actor: Actor.root(),
            userId: referrerId,
            amount: 50,
            transfer: {
              label: `Bonus de parrainage (${name})`,
            },
          }),
        ),
        this.intentBus.handle(
          new CreditUserBalanceCommand({
            actor: Actor.root(),
            userId: id,
            amount: 50,
            transfer: {
              label: `Bonus de parrainage (${referrerName ?? "anonyme"})`,
            },
          }),
        ),
      ]);
    }

    if (duringShow) {
      const show = await this.showStore.load(duringShow);

      if (!show) {
        throw ApplicationError.notFound(Show, duringShow);
      }

      await this.intentBus.handle(
        new CreditUserBalanceCommand({
          actor: Actor.root(),
          userId: id,
          amount: show.reward,
          transfer: {
            label: show.name,
            thumbnailUrl: show.thumbnailUrl,
          },
        }),
      );
    }
  }
}
