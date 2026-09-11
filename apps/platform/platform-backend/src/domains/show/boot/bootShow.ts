import type { InMemoryIntentBus } from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoShowStore } from "../infra/mongo.show.store";
import { CreateShowCommandHandler } from "../applicatioin/commands/createShow.command";
import { AllShowsQueryHandler } from "../applicatioin/queries/allShows.query";

export function bootShow(db: Db, intentBus: InMemoryIntentBus) {
  const showStore = new MongoShowStore(db);

  intentBus.register(new CreateShowCommandHandler(showStore));

  intentBus.register(new AllShowsQueryHandler(showStore));

  return { showStore };
}
