import { info, warning } from "@actions/core";
import { glob } from "glob";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

async function replace(
  versions: number[],
  cwd: string,
  files: string[],
  regex: string,
  template: string
) {
  const replacement = template
    .replaceAll("${versions}", `${versions.join(", ")}`)
    .replaceAll("${minVersion}", Math.min(...versions).toString())
    .replaceAll("${maxVersion}", Math.max(...versions).toString())

    // Undocumented
    .replaceAll("$!{maxVersion}", "${versions}")
    .replaceAll("$!{maxVersion}", "${minVersion}")
    .replaceAll("$!{maxVersion}", "${maxVersion}");

  info(
    `Search for "${regex}" and replace with "${replacement}" in these files:\n- ${files.join(
      "\n- "
    )}`
  );

  for (const file of files) {
    const contents = await readFile(join(cwd, file), "utf8");

    await writeFile(
      join(cwd, file),
      contents.replace(new RegExp(regex), replacement),
      "utf8"
    );
  }
}

export async function files(
  versions: number[],
  updatersFilesGlob: string[],
  updatersFilesRegex: string[],
  updatersFilesTemplate: string[],
  cwd = process.cwd()
) {
  if (!updatersFilesGlob.length) {
    warning("No glob patterns specified");
    return;
  }

  if (updatersFilesRegex.length > 1 || updatersFilesTemplate.length > 1) {
    // All inputs should have the same length
    if (
      updatersFilesGlob.length !== updatersFilesRegex.length ||
      updatersFilesGlob.length !== updatersFilesTemplate.length
    ) {
      warning(
        "updatersFilesGlob, updatersFilesRegex and updatersFilesTemplate should have the same length, ignoring the files updater"
      );
      return;
    }
  }

  const fileSets: string[][] = [];

  for (const globLine of updatersFilesGlob) {
    fileSets.push(await glob(globLine, { ignore: "node_modules/**", cwd }));
  }

  // If we have a single regex or template, we'll use it for all globs
  if (updatersFilesRegex.length === 1) {
    for (const files of fileSets) {
      await replace(
        versions,
        cwd,
        files,
        updatersFilesRegex[0]!,
        updatersFilesTemplate[0]!
      );
    }
    return;
  }

  // If we have multiple sets of regexes and templates, use respective entries
  for (let i = 0; i < fileSets.length; i++) {
    await replace(
      versions,
      cwd,
      fileSets[i]!,
      updatersFilesRegex[i]!,
      updatersFilesTemplate[i]!
    );
  }
}
