import assert from "assert";
import { readFile, writeFile } from "fs/promises";
import { join } from "node:path";
import { temporaryDirectory } from "tempy";
import { files } from "../../src/updaters/files.js";

export async function testSimpleFile() {
  const directory = temporaryDirectory();
  await writeFile(join(directory, "foo.txt"), "node >=1");

  await files(
    [10, 11],
    ["foo.txt"],
    ["node >=\\d+"],
    ["node >=${minVersion}"],
    directory
  );

  const contents = await readFile(join(directory, "foo.txt"), "utf8");

  assert.equal(contents, "node >=10");
}

export async function testPattern() {
  const directory = temporaryDirectory();
  await writeFile(join(directory, "foo.txt"), "node version 1");

  await files(
    [10, 11],
    ["foo.txt"],
    ["node(.*)\\d+"],
    ["node$1${minVersion}"],
    directory
  );

  const contents = await readFile(join(directory, "foo.txt"), "utf8");

  assert.equal(contents, "node version 10");
}

export async function testMultipleFiles() {
  const directory = temporaryDirectory();
  await writeFile(join(directory, "foo.txt"), "node 1");
  await writeFile(join(directory, "bar.txt"), "node 1");

  await files(
    [10, 11],
    ["*.txt"],
    ["node \\d+"],
    ["node ${maxVersion}"],
    directory
  );

  assert.equal(await readFile(join(directory, "foo.txt"), "utf8"), "node 11");
  assert.equal(await readFile(join(directory, "bar.txt"), "utf8"), "node 11");
}

export async function testMultiplePatterns() {
  const directory = temporaryDirectory();
  await writeFile(join(directory, "foo.txt"), "node version 1");
  await writeFile(join(directory, "bar.txt"), "node 1");

  await files(
    [10, 11],
    ["foo.txt", "bar.txt"],
    ["node version \\d+", "node \\d+"],
    ["node version ${maxVersion}", "node ${minVersion}"],
    directory
  );

  assert.equal(
    await readFile(join(directory, "foo.txt"), "utf8"),
    "node version 11"
  );
  assert.equal(await readFile(join(directory, "bar.txt"), "utf8"), "node 10");
}
