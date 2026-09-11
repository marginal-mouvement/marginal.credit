import {
  type DatetimeService,
  type KeyId,
  type TransactionPerformer,
  ApplicationError,
  Command,
  CommandHandler,
} from "@marginal.credit/backend-framework";

import type { Email } from "../../domain/email";
import type { UserStore } from "../user.store";
import type { KeyStore } from "../../../key/application/key.store";
import { User } from "../../domain/user";
import { Key } from "../../../key/domain/key";

export class ClaimKeyCommand extends Command<User> {
  constructor(
    readonly payload: {
      email: Email;
      name: string;
      keyId: KeyId;
      refererName: string | undefined;
    },
  ) {
    super();
  }
}

export class ClaimKeyCommandHandler extends CommandHandler(ClaimKeyCommand) {
  constructor(
    private readonly userStore: UserStore,
    private readonly keyStore: KeyStore,
    private readonly transactionPerformer: TransactionPerformer,
    private readonly datetimeService: DatetimeService,
  ) {
    super();
  }

  async execute(command: ClaimKeyCommand) {
    const { keyId, name, refererName, email } = command.payload;
    const now = this.datetimeService.now();

    let referrer: User | undefined;

    if (refererName) {
      referrer = await this.userStore.loadByName(refererName);

      if (!referrer) {
        throw ApplicationError.notFound(User, refererName);
      }
    }

    return await this.transactionPerformer.perform(async (transaction) => {
      const existingName = await this.userStore.loadByName(name, transaction);

      if (existingName) {
        throw ApplicationError.conflict(`Name "${name}" taken`);
      }

      const key = await this.keyStore.load(keyId, transaction);

      if (!key) {
        throw ApplicationError.notFound(Key, keyId);
      }

      const user = User.create({
        name,
        email,
        referrerId: referrer?.id,
        referrerName: referrer?.name,
        duringShow: key.showId,
        at: now,
      });

      key.assign(user.id, now);

      await this.userStore.save(user, transaction);
      await this.keyStore.save(key, transaction);

      return user;
    });
  }
}
