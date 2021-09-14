import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { assertSpyCalls } from "https://deno.land/x/mock@0.10.1/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { File, makeFile } from "../models.ts";
import { findArt } from "./find-art.ts";

Deno.test(
  `findArt:
    If the passed in File already had meta.art
    it does nothing and returns it`,
  async () => {
    const input: File = makeFile("/music/foo.wav", {
      art: makeFile("/music/folder.jpg"),
    });

    const prompt = spy(() =>
      Promise.resolve("/this/should/not/get/called.pdf")
    );

    const output = await findArt(
      [],
      prompt,
    )(input, "/tmp/workdir");

    assertEquals(output, input);
    assertSpyCalls(prompt, 0);
  },
);

const input = makeFile("/album/01.flac");
const artPath = "/album/folder.jpg";

Deno.test(
  `findArt:
    If there is a single art file
    and input has no art
    it adds it to the outputted file meta`,
  async () => {
    const artFile = makeFile(artPath);
    const files = [artFile, input];
    const prompt = () => Promise.resolve("0");

    const output = await findArt(files, prompt)(input, "/tmp");

    assertEquals(output.meta?.art?.path, artPath);
  },
);

Deno.test(
  `findArt:
    If there are no art files
    and input has no art
    it does nothing`,
  async () => {
    const files = [input];
    const prompt = () => Promise.resolve("");
    const output = await findArt(files, prompt)(input, "/tmp");

    assertEquals(output, input);
  },
);

Deno.test(
  `findArt:
    If there are multiple art files
    and input has no art
    then it prompts the user to choose one
    and adds the chosen one to the output meta.`,
  async () => {
    const artFile = makeFile(artPath);
    const files = [
      makeFile("/album/folder_back.jpg"),
      artFile,
      input,
    ];
    const prompt = spy(() => Promise.resolve("1"));

    const output = await findArt(files, prompt)(input, "/tmp");

    assertSpyCalls(prompt, 1);
    assertEquals(output.meta?.art?.path, artPath);
  },
);

Deno.test(
  `findArt:
    If called multiple times with files without art
    it only prompts to select art once.`,
  async () => {
    const artFile = makeFile(artPath);
    const inputA = makeFile("/album/01.flac");
    const inputB = makeFile("/album/02.flac");
    const files = [
      inputA,
      inputB,
      artFile,
      makeFile("/album/folder_back.jpg"),
    ];
    // it's unfortunate that the test has to be aware of the filtering mechanism
    // that the passed in prompt uses.  Note that I'm passing "1" below which is
    // the index of the chosen art file, not the index of all files.
    const prompt = spy(() => Promise.resolve("0"));
    const transformer = findArt(files, prompt);
    await transformer(input, "/tmp");
    await transformer(input, "/tmp");

    assertSpyCalls(prompt, 1);
  },
);
