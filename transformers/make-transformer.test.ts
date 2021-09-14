import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { ALL_FILES, makeTransformer } from "./make-transformer.ts";
import { makeFile } from "../models.ts";

const transformer = makeTransformer(
  ["png"],
  () => ({ extension: "jpg", path: "/foo/foo.jpg", meta: {} }),
);

Deno.test("makeTransformer - acceptsFile only correctly detects desired file", () => {
  assertEquals(
    transformer.acceptsFile({
      extension: "png",
      path: "bar/foo.png",
      meta: {},
    }),
    true,
  );
});

Deno.test("makeTransformer - acceptsFile rejects undesired file", () => {
  assertEquals(
    transformer.acceptsFile({
      extension: "flac",
      path: "bar/foo.flac",
      meta: {},
    }),
    false,
  );
});

Deno.test("makeTransformer - creates a transformer that accepts any file", () => {
  const transformer = makeTransformer(
    ALL_FILES,
    () => ({ extension: "jpg", path: "/foo/foo.jpg", meta: {} }),
  );

  assertEquals(transformer.acceptsFile(makeFile("foo")), true);
});
