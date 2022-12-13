import assert from "assert";
import { readFile, writeFile } from "fs/promises";
import { join } from "node:path";
import { temporaryDirectory } from "tempy";
import { packageJson } from "../../src/updaters/packageJson.js";

const FIXTURE = `
{
  "name": "test",
  "engines": {
    "node": ">=1"
  }
}
`;

export async function testPackageJson() {
  const directory = temporaryDirectory();
  await writeFile(join(directory, "package.json"), FIXTURE);

  await packageJson([10, 11], directory);

  const contents = await readFile(join(directory, "package.json"), "utf8");
  const data = JSON.parse(contents) as any;

  assert.deepEqual(data.engines.node, ">=10");
}

export async function testPackageJsonWithNoPackageJson() {
  const directory = temporaryDirectory();

  await packageJson([10, 11], directory);

  assert(true);
}
