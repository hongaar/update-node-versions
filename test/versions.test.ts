import assert from "node:assert";
import { filterEol, resolve, toMajor } from "../src/versions.js";

export async function testResolve() {
  const versions = await resolve(["lts", "lts/-1", "lts/-2"]);

  assert(Array.isArray(versions), "resolve returns an array");
  assert(versions.length > 0, "resolve returns a non-empty array");
  assert(
    typeof versions[0] === "string",
    "resolve returns an array of strings"
  );
}

export async function testToMajor() {
  const versions = toMajor(["1.0.0", "2.0.0", "3.0.0"]);

  assert.deepEqual(versions, [1, 2, 3], "toMajor returns an array of numbers");
}

export async function testFilterEol() {
  const versions = await filterEol([1, 12, 14, 16, 18, 20]);

  assert(Array.isArray(versions), "filterEol returns an array");
  assert(versions.length > 0, "filterEol returns a non-empty array");
  assert(
    typeof versions[0] === "number",
    "filterEol returns an array of numbers"
  );
}
