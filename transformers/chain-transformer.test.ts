import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { chainTransformers } from "./chain-transformer.ts";
import { makeTransformer } from "./make-transformer.ts";
import { assertSpyCall } from "https://deno.land/x/mock@0.10.1/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { makeFile } from "../models.ts";

Deno.test("chainTransformers - given two transformers pipes the output of one transformer into the other via a temp file", async () => {
  const tempDir = "/temp";
  const compressedFile = makeFile("/compressed/bar.compressed");
  const expandedFile = {
    extension: "expanded",
    path: `${tempDir}/bar.expanded`,
  };
  const encodedFile = { extension: "encoded", path: "/foo/bar.encoded" };
  const decoderSpy = spy(() => expandedFile);
  const decoder = makeTransformer(
    ["compressed"],
    decoderSpy,
  );

  const encoderSpy = spy(() => encodedFile);
  const encoder = makeTransformer(
    ["expanded"],
    encoderSpy,
  );

  const chained = chainTransformers(tempDir, [decoder, encoder]);

  const outputFile = await chained.transform(compressedFile, "/foo");

  // first transformer called with original inputed file and path to temp dir
  assertSpyCall(decoderSpy, 0, { args: [compressedFile, tempDir] });
  // second transformer is called with the result of first, but recieves
  // final output dir
  assertSpyCall(encoderSpy, 0, { args: [expandedFile, "/foo"] });
  // it returns the file returned from the last transformer (second)
  assertEquals(outputFile, encodedFile);
});
