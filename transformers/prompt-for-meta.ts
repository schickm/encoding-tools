import { TransformFunc } from "./make-transformer.ts";
import { ALBUM_STRING_FIELDS, File, makeFile, MetaData } from "../models.ts";

type PromptAdapter = (message: string) => Promise<string>;
type ToggleAdapter = (message: string) => Promise<boolean>;

export const promptForMeta = (
  prompt: PromptAdapter,
  toggle: ToggleAdapter,
): TransformFunc => {
  const shouldPrompt = (field: string) =>
    toggle(`${field} is empty, update it?`);

  return async (file: File, _destinationDir: string) => {
    const newMeta: MetaData = {};

    for (const field of ALBUM_STRING_FIELDS) {
      if (!file.meta[field] && await shouldPrompt(field)) {
        newMeta[field] = await prompt(`${field}`);
      }
    }

    return makeFile(file.path, { ...newMeta, ...file.meta });
  };
};
