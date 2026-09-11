import { Environment } from "@marginal.credit/backend-framework";
import { buildWithEsBuild, execute } from "@marginal.credit/tools";

import packageJson from "../../../package.json";

const EXTERNAL_DEPS = ["@hono/node-server", "hono"] as const;

async function build() {
  const buildDest = Environment.get("PLATFORM_BUILD_DEST");

  await buildWithEsBuild({
    packageJson,
    entryPoint: "./src/server.ts",
    external: EXTERNAL_DEPS,
    outfile: `${buildDest}/app.js`,
  });
}

execute(build);
