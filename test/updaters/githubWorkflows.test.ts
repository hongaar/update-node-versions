import assert from "assert";
import { mkdir, readFile, writeFile } from "fs/promises";
import { load } from "js-yaml";
import { join } from "node:path";
import { temporaryDirectory } from "tempy";
import { githubWorkflows } from "../../src/updaters/githubWorkflows.js";

const FIXTURE = `
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [1, 2, 3]
    steps:
      - uses: actions/checkout@v3
      - run: yarn install
`;

export async function testGithubWorkflows() {
  const directory = temporaryDirectory();
  await mkdir(join(directory, ".github/workflows"), { recursive: true });
  await writeFile(join(directory, ".github/workflows/test.yml"), FIXTURE);

  await githubWorkflows([10, 11], "node-version", directory);

  const contents = await readFile(
    join(directory, ".github/workflows/test.yml"),
    "utf8"
  );
  const data = load(contents) as any;

  assert.deepEqual(data.jobs.test.strategy.matrix["node-version"], [10, 11]);
}

export async function testGithubWorkflowsWithNoDirectory() {
  const directory = temporaryDirectory();

  await githubWorkflows([], "node-version", directory);

  assert(true);
}
