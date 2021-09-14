import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.115.0/testing/asserts.ts";
import { learningTest } from "./test.ts";
import { withTempDir, withTempFilePath } from "./with-temp.ts";

learningTest(
  "withTempDir - creates a directory during execution of function, and deletes it afterwards",
  async () => {
    let tempDir = "INITIAL_VALUE";

    await withTempDir((dir) => {
      tempDir = dir;
      assertEquals(Deno.statSync(tempDir).isDirectory, true);
    })();

    assertNotEquals(tempDir, "INITIAL_VALUE");
    assertThrows(() => Deno.statSync(tempDir), Deno.errors.NotFound);
  },
);

learningTest(
  "withTempFilePath - creates a file during execution of function, and deletes it afterwards",
  async () => {
    let tempPath = "INITIAL_VALUE";

    await withTempFilePath((path) => {
      tempPath = path;
    })();

    assertNotEquals(tempPath, "INITIAL_VALUE", "tempPath was unchanged");
    assertThrows(() => Deno.statSync(tempPath), Deno.errors.NotFound);
  },
);
