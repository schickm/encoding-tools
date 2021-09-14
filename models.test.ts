import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { makeFile } from "./models.ts";

Deno.test("makeFile - given a path, return object with an extension", () => {
  const file = makeFile("/foo/blah.mp3");
  assertEquals(file.extension, "mp3");
});

Deno.test("makeFile - given a path, return object with a path", () => {
  const file = makeFile("/foo/blah.mp3");
  assertEquals(file.path, "/foo/blah.mp3");
});

Deno.test("makeFile - it adds an empty MetaData object if no values are provided", () => {
  const file = makeFile("/foo/blah.mp3");
  assertEquals(file.meta, {});
});
