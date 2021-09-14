import { File, MetaData } from "../../models.ts";
import { Metaflac } from "./metaflac.ts";

const flacMetaAttributes = [
  "title",
  "artist",
  "album",
  "albumartist",
  "year",
  "tracknumber",
  "genre",
] as const;

export function getFlacMeta(metaflac: Metaflac) {
  return async function (file: File) {
    const meta: MetaData = {};
    for (const attribute of flacMetaAttributes) {
      const value = await metaflac.getMeta(file, attribute);
      if (value) {
        meta[attribute] = value;
      }
    }

    if (await metaflac.hasArt(file)) {
      meta.art = await metaflac.getArt(file);
    }

    return meta;
  };
}
