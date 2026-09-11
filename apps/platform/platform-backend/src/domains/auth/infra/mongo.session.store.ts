import { MongoStore } from "@marginal.credit/backend-framework";
import type { Db } from "mongodb";

import { MongoSessionSerializer } from "./mongo.session.serializer";

import type { Session } from "../domain/session";
import type { SessionStore } from "../application/session.store";

export class MongoSessionStore
  extends MongoStore<Session>
  implements SessionStore
{
  constructor(db: Db) {
    super(db, "session", new MongoSessionSerializer());
  }
}
