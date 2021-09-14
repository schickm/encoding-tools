import { File } from "../models.ts";
export const ALL_FILES = Symbol("accept_all_files");

export type TransformFunc = (
  file: File,
  destination: string,
) => File | Promise<File>;

export interface FileTransformer {
  acceptsFile(file: File): boolean;
  transform: TransformFunc;
}

export function makeTransformer(
  fileExtensions: string[] | typeof ALL_FILES,
  transform: TransformFunc,
): FileTransformer {
  const acceptsFile = fileExtensions === ALL_FILES
    ? () => true
    : (file: File) => fileExtensions.includes(file.extension);

  return {
    acceptsFile,
    transform(file: File, destination: string) {
      if (acceptsFile(file)) {
        return transform(file, destination);
      } else {
        throw new Error("Invalid filetype recieved");
      }
    },
  };
}
