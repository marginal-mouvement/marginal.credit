import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import {
  Environment,
  handleError,
  Logger,
} from "@marginal.credit/backend-framework";
import { serveStatic } from "@hono/node-server/serve-static";

import { HELLO } from "./hello";
import { bootEndpoints } from "./boot/bootEndpoints";
import { globalBoot } from "./boot/globalBoot";

console.log(HELLO);

const { readerManager, subscriptionRegistry, intentBus } = globalBoot();

const app = new Hono();

app.use(logger());

const oops = Logger.for("Server");

app.onError(handleError(oops));

app.route(
  "/api",
  bootEndpoints(readerManager, subscriptionRegistry, intentBus),
);

const FRONTEND_RELATIVE_PATH = Environment.get("FRONTEND_RELATIVE_PATH");

app.get("/*", serveStatic({ root: FRONTEND_RELATIVE_PATH }));
app.get("*", serveStatic({ path: `${FRONTEND_RELATIVE_PATH}/index.html` }));

serve(
  {
    fetch: app.fetch,
    hostname: "127.0.0.1",
    port: 4444,
  },
  console.log,
);
