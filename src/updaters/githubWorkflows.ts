import { dump, load } from "js-yaml";
import { info } from "node:console";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import type { GithubWorkflow } from "../GithubWorkflow.js";

const WORKFLOWS_DIRECTORY = ".github/workflows";

async function getWorkflows(cwd = process.cwd()) {
  const workflows = new Map<string, GithubWorkflow>();

  try {
    const files = await readdir(join(cwd, WORKFLOWS_DIRECTORY));
    const paths = files.map((file) => join(cwd, WORKFLOWS_DIRECTORY, file));

    for (const path of paths) {
      workflows.set(path, load(await readFile(path, "utf8")) as GithubWorkflow);
    }
  } catch {}

  return workflows;
}

export async function githubWorkflows(
  versions: number[],
  variable: string,
  cwd = process.cwd()
) {
  const workflows = await getWorkflows(cwd);

  for (const path of workflows.keys()) {
    const workflow = workflows.get(path)!;
    let needsSave = false;

    // Iterate jobs
    for (const jobName of Object.keys(workflow.jobs ?? {})) {
      const job = workflow.jobs[jobName]!;

      // If we have a matrix strategy, search for the variable
      if (job.strategy?.matrix && typeof job.strategy.matrix === "object") {
        if (job.strategy.matrix[variable]) {
          info(
            `Updating ${variable} in jobs.${jobName} of workflow ${basename(
              path
            )}`
          );

          job.strategy.matrix[variable] = versions;
          needsSave = true;
        }
      }
    }

    if (needsSave) {
      await writeFile(path, dump(workflow), "utf8");
    }
  }
}
