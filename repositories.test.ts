import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { fileRepository } from "./repositories.ts";

Deno.test("FileRepository - ignores things that aren't files", () => {
  const files = [...fileRepository("/foo", [{
    isFile: false,
    name: "a_directory",
  }])];
  assertEquals(files, []);
});

Deno.test("FileRepository - it returns files that are in the given list", () => {
  const files = [
    ...fileRepository("/foo", [{ isFile: true, name: "01.flac" }]),
  ];
  assertEquals(files, [{
    extension: "flac",
    path: "/foo/01.flac",
    meta: {},
  }]);
});
