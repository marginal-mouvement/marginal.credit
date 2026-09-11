import { build as buildEsBuild, type BuildOptions } from "esbuild";

import fs from "fs";
import path from "path";

type PackageJson = {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
};

type BuildNodeAppOptions<DependencyName extends string> = {
  cwd?: string;
  packageJson: PackageJson;
  external: readonly DependencyName[];
  entryPoint: string;
  outfile: string;
  tsconfig?: string;
  buildOptions?: Omit<
    BuildOptions,
    | "entryPoints"
    | "outfile"
    | "bundle"
    | "platform"
    | "target"
    | "format"
    | "tsconfig"
    | "external"
  >;
};

type PnpmCatalog = Record<string, string>;

function findWorkspaceFile(cwd: string) {
  let currentDir = path.resolve(cwd);

  while (currentDir !== path.dirname(currentDir)) {
    const workspacePath = path.join(currentDir, "pnpm-workspace.yaml");

    if (fs.existsSync(workspacePath)) {
      return workspacePath;
    }

    currentDir = path.dirname(currentDir);
  }

  throw new Error(`Could not find pnpm-workspace.yaml from ${cwd}`);
}

function parseDefaultCatalog(workspaceContent: string): PnpmCatalog {
  const catalog: PnpmCatalog = {};
  const lines = workspaceContent.split(/\r?\n/);

  const catalogLineIndex = lines.findIndex(
    (line) => line.trim() === "catalog:",
  );

  if (catalogLineIndex === -1) {
    return catalog;
  }

  for (const line of lines.slice(catalogLineIndex + 1)) {
    if (!line.startsWith("  ")) {
      break;
    }

    const match = line.match(/^\s{2}['"]?([^'":]+)['"]?:\s*(.+)$/);

    if (!match) {
      continue;
    }

    const [, dependencyName, version] = match;

    if (!dependencyName || !version) {
      continue;
    }

    catalog[dependencyName] = version.trim().replace(/^['"]|['"]$/g, "");
  }

  return catalog;
}

function resolveDependencyVersion(
  dependencyName: string,
  version: string,
  catalog: PnpmCatalog,
) {
  if (version !== "catalog:") {
    return version;
  }

  const catalogVersion = catalog[dependencyName];

  if (!catalogVersion) {
    throw new Error(
      `Dependency "${dependencyName}" uses "catalog:" but is missing from pnpm-workspace.yaml catalog.`,
    );
  }

  return catalogVersion;
}

function buildMinimalPackageJson<DependencyName extends string>(
  packageJson: PackageJson,
  external: readonly DependencyName[],
  catalog: PnpmCatalog,
) {
  const dependencies = packageJson.dependencies ?? {};

  return {
    name: packageJson.name,
    version: packageJson.version,
    main: "app.js",
    dependencies: external.reduce<Record<string, string>>(
      (acc, dependencyName) => {
        const version = dependencies[dependencyName];

        if (!version) {
          throw new Error(
            `External dependency "${dependencyName}" is not declared in package.json dependencies.`,
          );
        }

        acc[dependencyName] = resolveDependencyVersion(
          dependencyName,
          version,
          catalog,
        );

        return acc;
      },
      {},
    ),
  };
}

export async function buildWithEsBuild<DependencyName extends string>({
  cwd = process.cwd(),
  packageJson,
  external,
  entryPoint,
  outfile,
  tsconfig = "./tsconfig.json",
  buildOptions,
}: BuildNodeAppOptions<DependencyName>) {
  await buildEsBuild({
    entryPoints: [entryPoint],
    outfile,
    bundle: true,
    platform: "node",
    target: ["node20"],
    format: "cjs",
    sourcemap: false,
    tsconfig,
    external: [...external],
    ...buildOptions,
  });

  const workspacePath = findWorkspaceFile(cwd);
  const catalog = parseDefaultCatalog(fs.readFileSync(workspacePath, "utf-8"));
  const minimalPackageJson = buildMinimalPackageJson(
    packageJson,
    external,
    catalog,
  );

  fs.writeFileSync(
    path.join(path.dirname(outfile), "package.json"),
    JSON.stringify(minimalPackageJson, null, 2),
  );
}
