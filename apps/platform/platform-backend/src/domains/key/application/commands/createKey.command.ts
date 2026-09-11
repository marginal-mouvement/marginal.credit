import type {
  KeyId,
  TransactionPerformer,
} from "@marginal.credit/backend-framework";
import {
  ApplicationError,
  Command,
  CommandHandler,
} from "@marginal.credit/backend-framework";

import type { Actor } from "../../../auth/domain/actor";
import { Key } from "../../domain/key";
import type { KeyStore } from "../key.store";
import type { ShowId } from "../../../show/domain/showId";
import type { ShowStore } from "../../../show/applicatioin/show.store";
import { Show } from "../../../show/domain/show";

export class CreateKeyCommand extends Command<{ id: KeyId }> {
  constructor(
    readonly payload: {
      actor: Actor;
      showId?: ShowId;
    },
  ) {
    super();
  }
}

export class CreateKeyCommandHandler extends CommandHandler(CreateKeyCommand) {
  constructor(
    private readonly keyStore: KeyStore,
    private readonly showStore: ShowStore,
    private readonly transactionPerformer: TransactionPerformer,
  ) {
    super();
  }

  async execute(command: CreateKeyCommand) {
    const { actor, showId } = command.payload;

    actor.ensureIsAtLeastStation();

    const keyId = await this.transactionPerformer.perform(
      async (transaction) => {
        if (showId) {
          const show = await this.showStore.load(showId, transaction);

          if (!show) {
            throw ApplicationError.notFound(Show, showId);
          }
        }

        const key = Key.create(showId);

        await this.keyStore.save(key);

        return key.id;
      },
    );

    return { id: keyId };
  }
}
