import type {
  InMemoryEventBus,
  InMemoryIntentBus,
  MongoTransactionPerformer,
  NodeDatetimeService,
} from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { ClaimKeyCommandHandler } from "../application/commands/claimKey.command";
import type { MongoKeyStore } from "../../key/infra/mongo.key.store";
import { MongoUserStore } from "../infra/mongo.userStore";
import { CreditUserBalanceCommandHandler } from "../application/commands/creditUserBalance.command";
import { DebitUserBalanceCommandHandler } from "../application/commands/debitUserBalance.command";
import { UserSaga } from "../application/user.saga";
import type { MongoShowStore } from "../../show/infra/mongo.show.store";
import { MeQueryHandler } from "../application/queries/me.query";
import { UserByKeyQueryHandler } from "../application/queries/userByKey.query";

export function bootUser(
  intentBus: InMemoryIntentBus,
  keyStore: MongoKeyStore,
  transactionPerformer: MongoTransactionPerformer,
  eventBus: InMemoryEventBus,
  dateTimeService: NodeDatetimeService,
  showStore: MongoShowStore,
  db: Db,
) {
  const userStore = new MongoUserStore(db).publishAggregateEventsTo(eventBus);

  intentBus.register(
    new ClaimKeyCommandHandler(
      userStore,
      keyStore,
      transactionPerformer,
      dateTimeService,
    ),
  );

  intentBus.register(
    new CreditUserBalanceCommandHandler(
      transactionPerformer,
      userStore,
      dateTimeService,
    ),
  );

  intentBus.register(
    new DebitUserBalanceCommandHandler(
      transactionPerformer,
      userStore,
      dateTimeService,
    ),
  );

  intentBus.register(new MeQueryHandler(userStore));

  intentBus.register(new UserByKeyQueryHandler(keyStore, userStore));

  new UserSaga(intentBus, showStore).listen(eventBus);

  return { userStore };
}
