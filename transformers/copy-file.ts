import { basename, join } from "https://deno.land/std@0.110.0/path/mod.ts";
import { TransformFunc } from "./make-transformer.ts";
import { makeFile } from "../models.ts";

export const copyFile: TransformFunc = async (file, destinationDir) => {
  const destinationFile = join(destinationDir, basename(file.path));
  await Deno.copyFile(file.path, destinationFile);
  return makeFile(destinationFile, file.meta);
};
