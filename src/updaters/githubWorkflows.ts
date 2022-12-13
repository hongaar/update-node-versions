import { info } from "@actions/core";
import { updateYamlDocument } from "@atomist/yaml-updater";
import { load } from "js-yaml";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import type { GithubWorkflow } from "../GithubWorkflow.js";

const WORKFLOWS_DIRECTORY = ".github/workflows";

async function getWorkflows(cwd = process.cwd()) {
  const workflows = new Set<string>();

  try {
    const files = await readdir(join(cwd, WORKFLOWS_DIRECTORY));
    const paths = files.map((file) => join(cwd, WORKFLOWS_DIRECTORY, file));

    for (const path of paths) {
      workflows.add(path);
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

  for (const path of workflows.values()) {
    let workflowContents = await readFile(path, "utf8");
    const workflowData = load(workflowContents) as GithubWorkflow;
    let needsSave = false;

    // Iterate jobs
    for (const jobName of Object.keys(workflowData.jobs ?? {})) {
      const job = workflowData.jobs[jobName]!;

      // If we have a matrix strategy and our variable is found, update it
      if (
        job.strategy?.matrix &&
        typeof job.strategy.matrix === "object" &&
        job.strategy.matrix[variable]
      ) {
        info(
          `Updating ${variable} in jobs.${jobName} of workflow ${basename(
            path
          )}`
        );

        workflowContents = updateYamlDocument(
          {
            jobs: {
              [jobName]: {
                strategy: {
                  matrix: {
                    [variable]: versions,
                  },
                },
              },
            },
          },
          workflowContents,
          { keepArrayIndent: true }
        );

        needsSave = true;
      }
    }

    // Save changes if needed
    if (needsSave === true) {
      await writeFile(path, workflowContents);
    }
  }
}
