import type { Context } from "hono";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import {
  Environment,
  handleError,
  Logger,
} from "@marginal.credit/backend-framework";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";

import { globalBoot } from "./boot/globalBoot";
import { bootRoutes } from "./boot/bootRoutes";
import { HonoRequestContext } from "./domains/auth/infra/hono.requestContext";

const app = new Hono();

app.use(logger());
app.use(cors());

const oops = Logger.for("Server");

const { intentBus, authenticator } = globalBoot();

const authenticateFunction = (ctx: Context) =>
  authenticator.authenticate(new HonoRequestContext(ctx));

app.route("/api", bootRoutes(intentBus, authenticateFunction));

app.onError(handleError(oops));

const FRONTEND_RELATIVE_PATH = Environment.get("FRONTEND_RELATIVE_PATH");

app.get("/*", serveStatic({ root: FRONTEND_RELATIVE_PATH }));
app.get("*", serveStatic({ path: `${FRONTEND_RELATIVE_PATH}/index.html` }));

serve(
  {
    fetch: app.fetch,
    hostname: "0.0.0.0",
    port: Number.parseInt(Environment.get("PORT"), 10),
  },
  console.log,
);
