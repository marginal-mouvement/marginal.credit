import { Environment } from "@marginal.credit/backend-framework";
import { buildWithEsBuild, execute } from "@marginal.credit/tools";

import packageJson from "../../../package.json";

const EXTERNAL_DEPS = [
  "@tockawa/nfc-pcsc",
  "hono",
  "@hono/node-server",
] as const;

async function build() {
  const buildDest = Environment.get("STATION_BUILD_DEST");

  await buildWithEsBuild({
    packageJson,
    entryPoint: "./src/server.ts",
    external: EXTERNAL_DEPS,
    outfile: `${buildDest}/app.js`,
  });
}

execute(build);
