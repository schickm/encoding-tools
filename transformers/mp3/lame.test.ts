import {
  assertNotEquals,
} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import lame from "./lame.ts";
import { makeFile } from "../../models.ts";
import { learningTest } from "../../test.ts";
import { withTempFilePath } from "../../with-temp.ts";

const wav = makeFile("fixtures/6 - We Are Climbing.wav");

learningTest(
  "lame.encode - writes a file to the passed in destination",
  withTempFilePath(
    async (path) => {
      await lame.encode(wav, path);

      assertNotEquals(Deno.statSync(path).size, 0);
    },
  ),
);

learningTest(
  "lame.encode - encodes metadata if available in the file",
  withTempFilePath(
    async (path) => {
      const wav = makeFile("fixtures/6 - We Are Climbing.wav", {
        artist: "Norman Blake",
        title: "We Are Climbing",
        tracknumber: "6",
        year: "1970",
        album: "Some album",
        genre: "folk",
      });
      await lame.encode(wav, path);
      assertNotEquals(Deno.statSync(path).size, 0);
    },
  ),
);
