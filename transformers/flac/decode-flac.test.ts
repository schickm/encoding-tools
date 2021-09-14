import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";

import { makeFile } from "../../models.ts";
import { decodeFlac as decodeFlacFactory } from "./decode-flac.ts";

const metaflac = {
  getMeta: () => Promise.resolve("foo"),
  hasArt: () => Promise.resolve(false),
  getArt: () => Promise.resolve(makeFile("aoeu.png")),
};

const flac = {
  decode: () => Promise.resolve(),
};

const decodeFlac = decodeFlacFactory(metaflac, flac);

const file = makeFile("/input_files/foo.flac");

const resultFile = await decodeFlac(file, "/output");

Deno.test("decodeFlac - returns metadata about the flac file", () => {
  assertEquals(resultFile.meta, {
    artist: "foo",
    album: "foo",
    albumartist: "foo",
    genre: "foo",
    title: "foo",
    tracknumber: "foo",
    year: "foo",
  });
});

Deno.test("decodeFlac - returns a file with a wav extension", () => {
  assertEquals(resultFile.extension, "wav");
});

Deno.test("decodeFlac - it stores the file in the destination directory, but reuses the original file name with a wav extension", () => {
  assertEquals(resultFile.path, "/output/foo.wav");
});
