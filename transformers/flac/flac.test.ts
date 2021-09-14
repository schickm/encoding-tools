import { assertNotEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import flac from "./flac.ts";
import { makeFile } from "../../models.ts";
import { learningTest } from "../../test.ts";
import { withTempFilePath } from "../../with-temp.ts";

const flacFileWithArt = makeFile(
  "fixtures/6 - We Are Climbing - embedded art.flac",
);

learningTest(
  "decode - writes a file to the passed in destination",
  withTempFilePath(
    async (path) => {
      await flac.decode(flacFileWithArt, path);

      assertNotEquals(Deno.statSync(path).size, 0);
    },
  ),
);
