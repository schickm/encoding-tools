import {
  assertEquals,
  assertThrowsAsync,
} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { execCommand, runCommand } from "./adapters.ts";
import { learningTest } from "./test.ts";

learningTest(
  "runCommand - throws an error when given a bad command to execute",
  () => {
    assertThrowsAsync(() => runCommand(["foo", "bar", "baz"]));
  },
);

learningTest(
  "runCommand - it returns stdout when expected",
  async () => {
    const output = await runCommand(["echo", '"hello world"']);
    assertEquals(output, '"hello world"\n');
  },
);

learningTest(
  "execCommand - throws an error when given a bad command to execute",
  () => {
    assertThrowsAsync(() => execCommand(["foo", "bar", "baz"]));
  },
);
