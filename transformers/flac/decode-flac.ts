import { join, parse } from "https://deno.land/std@0.110.0/path/mod.ts";

import { File, makeFile } from "../../models.ts";
import { getFlacMeta } from "./get-flac-meta.ts";
import { Metaflac } from "./metaflac.ts";
import { Flac } from "./flac.ts";
import { TransformFunc } from "../make-transformer.ts";

export const decodeFlac = (
  metaflacAdapter: Metaflac,
  flacAdapter: Flac,
): TransformFunc =>
  async (file: File, destination: string) => {
    const { name } = parse(file.path);
    const wavPath = join(destination, `${name}.wav`);

    const meta = await (getFlacMeta(metaflacAdapter))(file);
    await flacAdapter.decode(file, wavPath);

    return makeFile(wavPath, meta);
  };
