import type { Db } from "mongodb";
import type {
  InMemoryIntentBus,
  MongoTransactionPerformer,
} from "@marginal.credit/backend-framework";

import { MongoKeyStore } from "../infra/mongo.key.store";
import { CreateKeyCommandHandler } from "../application/commands/createKey.command";
import type { MongoShowStore } from "../../show/infra/mongo.show.store";
import { IsKeyAvailableQueryHandler } from "../application/commands/isKeyAvailable.query";

export function bootKey(
  db: Db,
  intentBus: InMemoryIntentBus,
  transactionPerformer: MongoTransactionPerformer,
  showStore: MongoShowStore,
) {
  const keyStore = new MongoKeyStore(db);

  intentBus.register(
    new CreateKeyCommandHandler(keyStore, showStore, transactionPerformer),
  );

  intentBus.register(new IsKeyAvailableQueryHandler(keyStore));

  return { keyStore };
}
