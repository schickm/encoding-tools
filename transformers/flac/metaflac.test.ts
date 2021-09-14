import {
  assert,
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import metaflac from "./metaflac.ts";
import { File } from "../../models.ts";
import { learningTest } from "../../test.ts";

const flacFileNoArt: File = {
  path: "fixtures/01 - Roll On Buddy - no art.flac",
  extension: "flac",
  meta: {},
};

const flacFileWithArt: File = {
  path: "fixtures/6 - We Are Climbing - embedded art.flac",
  extension: "flac",
  meta: {},
};

learningTest("getMeta - returns metadata for a requested tag", async () => {
  const metadata = await metaflac.getMeta(flacFileNoArt, "artist");
  assertEquals(metadata, "Norman Blake");
});

learningTest(
  "getMeta - returns nothing if requested tag doesn't exist",
  async () => {
    const metadata = await metaflac.getMeta(flacFileNoArt, "year");
    assertEquals(metadata, undefined);
  },
);

learningTest("hasArt - returns true if file has embedded art", async () => {
  assertEquals(await metaflac.hasArt(flacFileWithArt), true);
});

learningTest(
  "hasArt - returns false if file doesn't have embedded art",
  async () => {
    assertEquals(await metaflac.hasArt(flacFileNoArt), false);
  },
);

learningTest(
  "getArt - returns File with correct type when flac has embedded art",
  async () => {
    const art = await metaflac.getArt(flacFileWithArt);
    assertObjectMatch(art, { extension: "jpeg" });
    assert(art.path);
  },
);
