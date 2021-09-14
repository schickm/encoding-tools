import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { assertSpyCalls } from "https://deno.land/x/mock@0.10.1/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { File, makeFile } from "../models.ts";
import { promptForMeta } from "./prompt-for-meta.ts";

Deno.test(
  `promptForMeta:
    If given a file with full metadata
    it does nothing and returns it`,
  async () => {
    const input = makeFile("/music/foo.flac", {
      album: "Roll On",
      albumartist: "Jack",
      tracknumber: "3",
      year: "2006",
      title: "Hello",
      genre: "Pop",
      artist: "Bill",
    });

    const output = await promptForMeta(
      () => Promise.resolve(""),
      () => Promise.resolve(true),
    )(input, "asneoh");

    assertEquals(output, input);
  },
);

Deno.test(
  `promptForMeta:
    If user declines via the toggle
    file is returned un-altered.`,
  async () => {
    const inputMeta = {
      album: "Roll On",
    };
    const inputFile = makeFile("/music/foo.flac", inputMeta);
    const prompt = () => Promise.resolve("foo");
    const toggle = () => Promise.resolve(false);
    const transformer = promptForMeta(prompt, toggle);

    const outputFile = await transformer(inputFile, "/foo/barr");

    assertEquals(outputFile, inputFile);
  },
);

Deno.test(
  `promptForMeta:
    If given a files missing album metadata (year)
    it prompts for it and returns an updated file`,
  async () => {
    const inputMeta = {
      album: "Roll On",
      albumartist: "Jack",
      tracknumber: "3",
      title: "Hello",
      genre: "Pop",
      artist: "Bill",
    };
    const input = makeFile("/music/foo.flac", inputMeta);
    const prompt = spy(() => Promise.resolve("2006"));
    const toggle = () => Promise.resolve(true);
    const transformer = promptForMeta(
      prompt,
      toggle,
    );

    const result = await transformer(input, "/foo/bar");

    assertEquals(result, makeFile(input.path, { ...inputMeta, year: "2006" }));
  },
);
