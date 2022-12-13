import { info } from "@actions/core";
import { isFuture, isPast, parseISO } from "date-fns";
import got from "got";
import { coerce, major } from "semver";

type Schedule = {
  [version: string]: {
    start: string;
    end: string;
    lts?: string;
    maintenance?: string;
    codename?: string;
  };
};

const SCHEDULE_URL =
  "https://raw.githubusercontent.com/nodejs/Release/master/schedule.json";

let cache: Schedule | undefined;

async function fetch() {
  info("Fetching Node schedule");

  return got.get(SCHEDULE_URL).json<Schedule>();
}

export async function schedule() {
  if (!cache) {
    cache = await fetch();
  }

  return cache;
}

export function majorEolMap(schedule: Schedule) {
  return Object.entries(schedule)
    .filter(([version]) => coerce(version))
    .map(([version, data]) => [coerce(version)!.version, data] as const)
    .reduce((map, [version, data]) => {
      map.set(major(version), isPast(parseISO(data.end)));

      return map;
    }, new Map() as Map<number, boolean>);
}

export function majorFutureReleaseMap(schedule: Schedule) {
  return Object.entries(schedule)
    .filter(([version]) => coerce(version))
    .map(([version, data]) => [coerce(version)!.version, data] as const)
    .reduce((map, [version, data]) => {
      map.set(major(version), isFuture(parseISO(data.start)));

      return map;
    }, new Map() as Map<number, boolean>);
}
