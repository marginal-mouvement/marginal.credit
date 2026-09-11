import { Environment, UserId } from "@marginal.credit/backend-framework";
import { AlgorithmTypes } from "hono/jwt";
import { execute } from "@marginal.credit/tools";

import { MongoSessionStore } from "../domains/auth/infra/mongo.session.store";
import { db } from "../infra/db";
import { Session } from "../domains/auth/domain/session";
import { Permission } from "../domains/auth/domain/permission";
import { HonoTokenParser } from "../domains/auth/infra/hono.tokenParser";

async function createStationSession() {
  const sessionStore = new MongoSessionStore(db);
  const tokenParser = new HonoTokenParser(
    AlgorithmTypes.HS256,
    Environment.get("JWT_KEY"),
  );

  const session = Session.create(
    {
      permission: Permission.station(),
      userId: UserId.station(),
    },
    new Date(),
  );

  await sessionStore.save(session);

  const token = await tokenParser.sign(session.id);

  console.log(token);
}

execute(createStationSession);
