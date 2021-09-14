import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { getFlacMeta } from "./get-flac-meta.ts";
import { File, makeFile } from "../../models.ts";

Deno.test("getFlacMeta - returns some meta data for a given flac file", async () => {
  const file = makeFile("bar/foo.flac");
  const metaflac = stubMetaflac({ hasArt: false, getMeta: "blah" });
  const metaData = await getFlacMeta(
    metaflac,
  )(file);

  assertEquals(metaData, {
    title: "blah",
    artist: "blah",
    album: "blah",
    albumartist: "blah",
    year: "blah",
    tracknumber: "blah",
    genre: "blah",
  });
});

Deno.test("getFlacMeta - it includes an Art file when metaflac returns one", async () => {
  const file = makeFile("bar/01.flac");
  const metaflac = stubMetaflac({});
  const metaData = await getFlacMeta(metaflac)(file);

  const art = metaData.art;
  assertEquals(art?.extension, "jpeg");
  assert(art?.path);
});

function stubMetaflac({
  getMeta = "foo",
  hasArt = true,
  getArt = makeFile("foo.jpeg"),
}) {
  return {
    getMeta: () => Promise.resolve(getMeta),
    hasArt: () => Promise.resolve(hasArt),
    getArt: () => Promise.resolve(getArt),
  };
}
