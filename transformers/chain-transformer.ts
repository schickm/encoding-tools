import { FileTransformer } from "./make-transformer.ts";
import { File } from "../models.ts";

async function chain(
  file: File,
  finalDestination: string,
  tempDir: string,
  transformers: FileTransformer[],
): Promise<File> {
  if (transformers.length === 0) {
    throw new Error("Must pass atleast one transformer to chain");
  }

  if (transformers.length === 1) {
    return transformers[0].transform(file, finalDestination);
  } else {
    const firstResult = await transformers[0].transform(file, tempDir);
    return chain(
      firstResult,
      finalDestination,
      tempDir,
      transformers.slice(1),
    );
  }
}

export function chainTransformers(
  tempDir: string,
  transformers: FileTransformer[],
): FileTransformer {
  return {
    acceptsFile: transformers[0].acceptsFile,
    transform(file, finalDestination) {
      return chain(file, finalDestination, tempDir, transformers);
    },
  };
}
