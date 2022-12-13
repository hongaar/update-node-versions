import assert from "node:assert";
import { schedule } from "../src/nodeSchedule.js";

export async function testSchedule() {
  const nodeSchedule = await schedule();

  assert(typeof nodeSchedule === "object", "schedule returns an object");
}
