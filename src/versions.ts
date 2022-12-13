import { info } from "@actions/core";
import nodeVersionAlias from "node-version-alias";
import semver from "semver";
import { majorEolMap, schedule } from "./nodeSchedule.js";

export async function resolve(versions: string[]) {
  info("Resolving Node versions");

  return Promise.all(versions.map((version) => nodeVersionAlias(version)));
}

export function toMajor(versions: string[]) {
  return versions
    .filter((version) => semver.valid(version))
    .map((version) => semver.major(version));
}

export async function filterEol(versions: number[]) {
  const map = majorEolMap(await schedule());

  return versions.filter(
    (version) => map.has(version) && map.get(version) === false
  );
}
