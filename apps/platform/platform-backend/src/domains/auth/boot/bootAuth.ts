import type { Db } from "mongodb";
import type { NodeDatetimeService } from "@marginal.credit/backend-framework";
import { Environment } from "@marginal.credit/backend-framework";
import { AlgorithmTypes } from "hono/jwt";

import { Authenticator } from "../application/authenticator";
import type { MongoKeyStore } from "../../key/infra/mongo.key.store";
import { MongoSessionStore } from "../infra/mongo.session.store";
import { HonoTokenParser } from "../infra/hono.tokenParser";

export function bootAuth(
  db: Db,
  keyStore: MongoKeyStore,
  dateTimeService: NodeDatetimeService,
) {
  const sessionStore = new MongoSessionStore(db);
  const tokenParser = new HonoTokenParser(
    AlgorithmTypes.HS256,
    Environment.get("JWT_KEY"),
  );

  const authenticator = new Authenticator(
    keyStore,
    sessionStore,
    tokenParser,
    dateTimeService,
  );

  return { authenticator };
}
