import {
  getBooleanInput,
  getInput,
  getMultilineInput,
  setFailed,
  setOutput,
} from "@actions/core";

import { updateNodeVersions } from "./updateNodeVersions.js";

const versions = getMultilineInput("versions");
const versionsFilterEol = getBooleanInput("versions.filter-eol");
const updatersWorkflows = getBooleanInput("updaters.workflows");
const updatersWorkflowsVariable = getInput("updaters.workflows.variable");
const updatersEngines = getBooleanInput("updaters.engines");

const inputs = {
  versions,
  versionsFilterEol,
  updatersWorkflows,
  updatersWorkflowsVariable,
  updatersEngines,
};

updateNodeVersions(inputs)
  .then((outputs) =>
    Object.entries(outputs).forEach(([key, value]) => {
      setOutput(key, value);
    })
  )
  .catch(setFailed);
