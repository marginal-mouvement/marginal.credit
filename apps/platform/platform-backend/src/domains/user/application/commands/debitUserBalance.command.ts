import type {
  DatetimeService,
  UserId,
  TransactionPerformer,
} from "@marginal.credit/backend-framework";
import {
  ApplicationError,
  Command,
  CommandHandler,
} from "@marginal.credit/backend-framework";

import type { UserStore } from "../user.store";
import { User } from "../../domain/user";
import type { Actor } from "../../../auth/domain/actor";

export class DebitUserBalanceCommand extends Command {
  constructor(
    readonly payload: {
      actor: Actor;
      userId: UserId;
      amount: number;
      transfer: {
        label: string;
        thumbnailUrl?: string;
      };
    },
  ) {
    super();
  }
}

export class DebitUserBalanceCommandHandler extends CommandHandler(
  DebitUserBalanceCommand,
) {
  constructor(
    private readonly transactionPerformer: TransactionPerformer,
    private readonly userStore: UserStore,
    private readonly datetimeService: DatetimeService,
  ) {
    super();
  }

  async execute(intent: DebitUserBalanceCommand) {
    const { userId, amount, actor } = intent.payload;
    actor.ensureIsAtLeastStation();
    const now = this.datetimeService.now();

    await this.transactionPerformer.perform(async (transaction) => {
      const user = await this.userStore.load(userId);

      if (!user) {
        throw ApplicationError.notFound(User, userId);
      }

      user.debit(amount, now, intent.payload.transfer);
      await this.userStore.save(user, transaction);
    });
  }
}
