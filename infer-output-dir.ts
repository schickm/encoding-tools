import {
  basename,
  join,
  resolve,
} from "https://deno.land/std@0.114.0/path/mod.ts";

type ToggleAdapter = (message: string) => Promise<boolean>;
type PromptOptions = {
  message: string;
  suggestions: string[];
};
type PromptAdapter = (options: PromptOptions) => Promise<string>;

export const inferOutputDirFactory = (
  toggle: ToggleAdapter,
  prompt: PromptAdapter,
) =>
  async function inferOutputDir(inputDir: string): Promise<string> {
    const inferredOutputBase = basename(inputDir).replace("flac", "mp3")
      .replace(
        "FLAC",
        "MP3",
      ).replace("Flac", "Mp3");
    const inferredOutputDir = join(inputDir, "..", inferredOutputBase);
    const useInferredOuput = await toggle(
      `use this as your default output?
${inferredOutputDir}`,
    );

    return useInferredOuput ? inferredOutputDir : resolve(
      await prompt({
        message: "enter output directory",
        suggestions: [inputDir],
      }),
    );
  };
