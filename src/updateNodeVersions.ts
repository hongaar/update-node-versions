import { info } from "@actions/core";
import pPipe from "p-pipe";
import { identity, uniq } from "ramda";
import { sort } from "semver";
import { engines } from "./updaters/engines.js";
import { files } from "./updaters/files.js";
import { githubWorkflows } from "./updaters/githubWorkflows.js";
import { filterEol, resolve, toMajor } from "./versions.js";

type Inputs = {
  versions: string[];
  versionsFilterEol: boolean;
  updatersWorkflows: boolean;
  updatersWorkflowsVariable: string;
  updatersEngines: boolean;
  updatersFiles: boolean;
  updatersFilesGlob: string[];
  updatersFilesRegex: string[];
  updatersFilesTemplate: string[];
};

type Outputs = {
  versions: number[];
};

export async function updateNodeVersions(inputs: Inputs) {
  info(`Inputs:\n${JSON.stringify(inputs, undefined, 2)}`);

  const filter = inputs.versionsFilterEol ? filterEol : identity<number[]>;

  const outputs: Outputs = {
    versions: [],
  };

  outputs.versions = await pPipe(
    resolve,
    uniq,
    sort,
    toMajor,
    filter
  )(inputs.versions);

  info(`Outputs:\n${JSON.stringify(outputs, undefined, 2)}`);

  if (inputs.updatersWorkflows) {
    await githubWorkflows(outputs.versions, inputs.updatersWorkflowsVariable);
  }

  if (inputs.updatersEngines) {
    await engines(outputs.versions);
  }

  if (inputs.updatersFiles) {
    await files(
      outputs.versions,
      inputs.updatersFilesGlob,
      inputs.updatersFilesRegex,
      inputs.updatersFilesTemplate
    );
  }

  return outputs;
}
