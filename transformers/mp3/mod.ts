import { makeTransformer } from "../make-transformer.ts";
import lame from "./lame.ts";
import { encodeMp3 as encodeMp3Factory } from "./encode-mp3.ts";

export const encodeMp3 = makeTransformer(
  ["wav"],
  encodeMp3Factory(lame),
);
