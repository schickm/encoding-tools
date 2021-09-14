import { makeRunWithLimit } from "https://deno.land/x/run_with_limit@v1.0.1/mod.ts";
const { runWithLimit } = makeRunWithLimit(navigator.hardwareConcurrency);

import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";
import {
  Input,
  Select,
  Toggle,
} from "https://deno.land/x/cliffy@v0.20.1/prompt/mod.ts";
import { basename } from "https://deno.land/std@0.106.0/path/mod.ts";
import { fileRepository } from "./repositories.ts";
import {
  ALL_FILES,
  chainTransformers,
  copyFile,
  decodeFlac,
  encodeMp3,
  findArt,
  makeTransformer,
  promptForMeta,
} from "./transformers/mod.ts";
import { inferOutputDirFactory } from "./infer-output-dir.ts";
import { makePromptCache } from "./prompt-cache.ts";
import { makeTorrent } from "./torrent.ts";
import { withTempDir } from "./with-temp.ts";
import * as colors from "https://deno.land/std@0.114.0/fmt/colors.ts";

const {
  args: [inputDir, cliOutputDir],
  options,
} = await new Command()
  .arguments("<input_dir> [<output_dir>]")
  .env("ANNOUNCE_URL=<value:string>", "Announce URL to put into torrent", {
    required: true,
  })
  .name("flac-to-mp3")
  .parse(Deno.args);

const inferOutputDir = inferOutputDirFactory(
  (msg) => Toggle.prompt(msg),
  (msg) => Input.prompt(msg),
);
const outputDir = cliOutputDir || await inferOutputDir(inputDir);
const ART_FILES = ["jpg", "png", "jpeg"];

await withTempDir(async (workDir) => {
  makeOutputDirectory();
  await processFiles(workDir);
  await makeTorrent(
    outputDir,
    options.announceUrl,
  );
})();

function makeOutputDirectory() {
  try {
    if (!Deno.statSync(outputDir).isDirectory) {
      console.error(`${outputDir} already exists and is not a directory.`);
      Deno.exit(1);
    }
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e;
    }

    Deno.mkdirSync(outputDir);
  }
}

async function processFiles(workDir: string) {
  const files = [...fileRepository(inputDir, [
    ...Deno.readDirSync(inputDir),
  ])];

  const transformers = [
    chainTransformers(workDir, [
      decodeFlac,
      makeTransformer(ALL_FILES, findArt(files, Select.prompt)),
      makeTransformer(
        ALL_FILES,
        promptForMeta(
          makePromptCache(Input.prompt.bind(Input)),
          makePromptCache(Toggle.prompt.bind(Toggle)),
        ),
      ),
      encodeMp3,
    ]),
    makeTransformer([...ART_FILES, "pdf"], copyFile),
  ];

  await Promise.all(files.map((file) =>
    runWithLimit(async () => {
      const transformer = transformers.find((t) => t.acceptsFile(file));
      if (transformer) {
        const output = await transformer.transform(file, outputDir);
        console.log(
          `${colors.green("encoded")} "${basename(file.path)}" -> ${
            basename(output.path)
          }`,
        );
      } else {
        console.log(`${colors.yellow("skipped")} "${basename(file.path)}"`);
      }
    })
  ));
}
