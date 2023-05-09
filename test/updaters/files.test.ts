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

  assert.equal(contents, "node >=1");
}
