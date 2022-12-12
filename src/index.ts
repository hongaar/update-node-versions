import {
  getInput,
  getMultilineInput,
  info,
  setFailed,
  setOutput,
} from "@actions/core";

async function run() {
  const versions = getMultilineInput("versions");
  const versionsFilterEol = getInput("versions.filter-eol");
  const updatersWorkflows = getInput("updaters.workflows");
  const updatersWorkflowsVariable = getInput("updaters.workflows.variable");
  const updatersEngines = getInput("updaters.engines");

  console.log({
    versions,
    versionsFilterEol,
    updatersWorkflows,
    updatersWorkflowsVariable,
    updatersEngines,
  });

  const versionsOutput = [14, 16, 18];

  info("Updating Node versions complete");

  return {
    versions: versionsOutput,
  };
}

run()
  .then((outputs) =>
    Object.entries(outputs).forEach(([key, value]) => {
      setOutput(key, value);
    })
  )
  .catch(setFailed);
