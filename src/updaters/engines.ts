import { info } from "@actions/core";
import { readFile, writeFile } from "node:fs/promises";
import { EOL } from "node:os";
import { join } from "node:path";
import type { PackageJson } from "../PackageJson.js";

const PACKAGE_PATH = "package.json";

async function getPackageJson(cwd = process.cwd()) {
  try {
    const packageJson = await readFile(join(cwd, PACKAGE_PATH), "utf8");

    return JSON.parse(packageJson) as PackageJson;
  } catch {}

  return;
}

export async function engines(versions: number[], cwd = process.cwd()) {
  const packageJson = await getPackageJson(cwd);

  if (!packageJson) {
    return;
  }

  if (packageJson.engines && packageJson.engines["node"]) {
    info(`Updating engines.node in package.json`);
    packageJson.engines["node"] = `>=${versions[0]}`;

    await writeFile(
      join(cwd, PACKAGE_PATH),
      JSON.stringify(packageJson, undefined, 2) + EOL,
      "utf8"
    );
  }
}
