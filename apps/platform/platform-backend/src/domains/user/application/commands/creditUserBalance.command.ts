import type {
  DatetimeService,
  TransactionPerformer,
  UserId,
} from "@marginal.credit/backend-framework";
import {
  ApplicationError,
  Command,
  CommandHandler,
} from "@marginal.credit/backend-framework";

import type { Actor } from "../../../auth/domain/actor";
import { User } from "../../domain/user";
import type { UserStore } from "../user.store";

export class CreditUserBalanceCommand extends Command {
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

export class CreditUserBalanceCommandHandler extends CommandHandler(
  CreditUserBalanceCommand,
) {
  constructor(
    private readonly transactionPerformer: TransactionPerformer,
    private readonly userStore: UserStore,
    private readonly datetimeService: DatetimeService,
  ) {
    super();
  }

  async execute(intent: CreditUserBalanceCommand) {
    const { userId, amount, actor } = intent.payload;
    actor.ensureIsAtLeastStation();

    const now = this.datetimeService.now();

    await this.transactionPerformer.perform(async (transaction) => {
      const user = await this.userStore.load(userId);

      if (!user) {
        throw ApplicationError.notFound(User, userId);
      }

      user.credit(amount, now, intent.payload.transfer);

      await this.userStore.save(user, transaction);
    });
  }
}
