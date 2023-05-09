import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { PackageJson } from "../PackageJson.js";

export async function files(
  versions: number[],
  updatersFilesGlob: string[],
  updatersFilesRegex: string[],
  updatersFilesTemplate: string[],
  cwd = process.cwd()
) {}
