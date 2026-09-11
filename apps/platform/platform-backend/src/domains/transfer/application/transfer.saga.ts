import type { IntentBus } from "@marginal.credit/backend-framework";
import { Saga } from "@marginal.credit/backend-framework";

import { CreateTransferCommand } from "./commands/createTransfer.command";

import {
  UserBalanceCredited,
  UserBalanceDebited,
} from "../../user/domain/user";
import { Actor } from "../../auth/domain/actor";

export class TransferSaga extends Saga {
  constructor(private readonly intentBus: IntentBus) {
    super();
  }

  @Saga.on(UserBalanceDebited)
  @Saga.on(UserBalanceCredited)
  async onUserBalanceChanged(event: UserBalanceDebited | UserBalanceCredited) {
    const { transfer, amount, id } = event.payload;

    await this.intentBus.handle(
      new CreateTransferCommand({
        actor: Actor.root(),
        userId: id,
        amount: amount,
        date: transfer.date,
        label: transfer.label,
        thumbnailUrl: transfer.thumbnailUrl,
        kind: event instanceof UserBalanceDebited ? "debit" : "credit",
      }),
    );
  }
}
