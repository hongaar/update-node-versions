import assert from "node:assert";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { temporaryDirectory } from "tempy";
import { updateNodeVersions } from "../src/updateNodeVersions.js";

export async function testUpdateNodeVersions() {
  const directory = temporaryDirectory();
  const previousCwd = process.cwd();

  process.chdir(directory);

  await mkdir(join(directory, ".github/workflows"), { recursive: true });

  const inputs = {
    versions: ["lts", "lts/-1", "lts/-2"],
    versionsFilterEol: true,
    updatersWorkflows: true,
    updatersWorkflowsVariable: "node-version",
    updatersEngines: true,
  };

  const { versions } = await updateNodeVersions(inputs);

  assert(Array.isArray(versions), "versions output is an array");
  assert(versions.length > 0, "versions ouput is not empty");
  assert(
    typeof versions[0] === "number",
    "versions output is array of numbers"
  );

  process.chdir(previousCwd);
}
