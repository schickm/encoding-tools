import { TransformFunc } from "./make-transformer.ts";
import { makeRunWithLimit } from "https://denopkg.com/alextes/run-with-limit@v1.0.1/mod.ts";
import { File, makeFile } from "../models.ts";

const { runWithLimit } = makeRunWithLimit<File>(1);

type SelectAdapter = (options: {
  message: string;
  options: {
    name: string;
    value: string;
  }[];
}) => Promise<string>;

const ART_FILES = ["jpg", "png", "jpeg"];

export const findArt = (
  files: File[],
  select: SelectAdapter,
): TransformFunc => {
  let chosenFile: File;
  const artFiles = files.filter((f) => ART_FILES.includes(f.extension));

  if (artFiles.length === 1) {
    chosenFile = artFiles[0];
  }

  return (file: File, _destinationDir: string) =>
    runWithLimit(async () => {
      if (file.meta?.art) {
        return file;
      }

      if (!chosenFile) {
        if (artFiles.length !== 0) {
          const options = artFiles.map((file, index) => ({
            name: file.path,
            value: index.toString(),
          }));
          const chosenIndex = await select(
            { message: "Choose your art", options },
          );
          chosenFile = artFiles[Number(chosenIndex)];
          if (!chosenFile) {
            throw new Error(
              `call to select returned impossible value: ${chosenIndex}`,
            );
          }
        }
      }

      return chosenFile
        ? makeFile(file.path, {
          ...file.meta,
          art: chosenFile,
        })
        : file;
    });
};
