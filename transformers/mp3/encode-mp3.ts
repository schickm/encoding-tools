import { join, parse } from "https://deno.land/std@0.110.0/path/mod.ts";

import { File, makeFile } from "../../models.ts";
import { Lame } from "./lame.ts";
import { TransformFunc } from "../make-transformer.ts";

export const encodeMp3 = (
  lameAdapter: Lame,
): TransformFunc =>
  async (file: File, destination: string) => {
    const fileDetails = parse(file.path);
    const outputPath = join(destination, `${fileDetails.name}.mp3`);
    await lameAdapter.encode(file, outputPath);
    return makeFile(outputPath);
  };
