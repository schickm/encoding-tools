import { makeTransformer } from "../make-transformer.ts";
import metaflac from "./metaflac.ts";
import flac from "./flac.ts";
import { decodeFlac as decodeFlacFactory } from "./decode-flac.ts";

export const decodeFlac = makeTransformer(
  ["flac"],
  decodeFlacFactory(metaflac, flac),
);
