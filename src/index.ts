import { getMultilineInput, info, setFailed, setOutput } from "@actions/core";

async function run() {
  const versionsInput = getMultilineInput("versions");

  console.log({ versionsInput });

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
