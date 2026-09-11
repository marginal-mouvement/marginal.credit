import { MongoClient } from "mongodb";
import { Environment } from "@marginal.credit/backend-framework";

export const db = new MongoClient(Environment.get("MONGO_URI"), {
  ignoreUndefined: true,
}).db("marginal-card");
