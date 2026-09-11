import {
  InMemoryEventBus,
  InMemoryIntentBus,
  MongoTransactionPerformer,
  NodeDatetimeService,
} from "@marginal.credit/backend-framework";

import { db } from "../infra/db";
import { bootUser } from "../domains/user/boot/bootUser";
import { bootAuth } from "../domains/auth/boot/bootAuth";
import { bootKey } from "../domains/key/boot/bootKey";
import { bootShow } from "../domains/show/boot/bootShow";
import { bootTransfer } from "../domains/transfer/boot/bootTransfer";

export function globalBoot() {
  const intentBus = new InMemoryIntentBus();
  const dateTimeService = new NodeDatetimeService();
  const eventBus = new InMemoryEventBus();
  const transactionPerformer = new MongoTransactionPerformer(db);

  const { showStore } = bootShow(db, intentBus);

  const { keyStore } = bootKey(db, intentBus, transactionPerformer, showStore);

  bootUser(
    intentBus,
    keyStore,
    transactionPerformer,
    eventBus,
    dateTimeService,
    showStore,
    db,
  );

  bootTransfer(db, intentBus, eventBus);

  const { authenticator } = bootAuth(db, keyStore, dateTimeService);

  return {
    intentBus,
    authenticator,
  };
}
