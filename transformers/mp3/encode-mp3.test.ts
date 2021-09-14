import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { assertSpyCall } from "https://deno.land/x/mock@0.10.1/asserts.ts";
import { encodeMp3 as encodeMp3Factory } from "./encode-mp3.ts";
import { makeFile } from "../../models.ts";

const lame = {
  encode: spy(() => Promise.resolve()),
};

const encodeMp3 = encodeMp3Factory(lame);

const file = makeFile("/input_files/foo.wav");

const resultFile = await encodeMp3(file, "/output");

Deno.test("encodeMp3 - encodes the input file with lame, and stores the file in the destination directory, but reuses the original file name with a mp3 extension", () => {
  assertSpyCall(lame.encode, 0, { args: [file, "/output/foo.mp3"] });
});

Deno.test("encodeMp3 - it returns a file object that points to an mp3 file", () => {
  assertEquals(resultFile.path, "/output/foo.mp3");
});
