import type { UserId } from "@marginal.credit/backend-framework";
import { Command, CommandHandler } from "@marginal.credit/backend-framework";

import { Transfer } from "../../domain/transfer";
import type { Actor } from "../../../auth/domain/actor";
import type { TransferStore } from "../transfer.store";

export class CreateTransferCommand extends Command {
  constructor(
    readonly payload: {
      actor: Actor;
      userId: UserId;
      amount: number;
      label: string;
      thumbnailUrl?: string;
      kind: "credit" | "debit";
      date: Date;
    },
  ) {
    super();
  }
}

export class CreateTransferCommandHandler extends CommandHandler(
  CreateTransferCommand,
) {
  constructor(private readonly transferStore: TransferStore) {
    super();
  }

  async execute(command: CreateTransferCommand) {
    const { actor, date, kind, amount, thumbnailUrl, label, userId } =
      command.payload;

    actor.ensureIsRoot();

    const transfer = Transfer.create({
      userId,
      label,
      amount,
      date,
      kind,
      thumbnailUrl,
    });

    await this.transferStore.save(transfer);
  }
}
