import { extname } from "https://deno.land/std@0.106.0/path/mod.ts";

export interface File {
  path: string;
  extension: string;
  meta: MetaData;
}

export function makeFile(path: string, meta?: MetaData) {
  const fileMeta = meta || {};

  const file: File = {
    path,
    extension: getExtension(path),
    meta: Object.freeze(fileMeta),
  };

  return Object.freeze(file);
}

function getExtension(fileName: string) {
  const extension = extname(fileName);
  return (extension[0] === ".") ? extension.substring(1) : extension;
}

export const ALBUM_STRING_FIELDS = [
  "artist",
  "album",
  "albumartist",
  "genre",
  "year",
] as const;

const TRACK_STRING_FIELDS = [
  "title",
  "tracknumber",
] as const;

export type MetaData =
  & {
    [Property in typeof ALBUM_STRING_FIELDS[number]]?: string;
  }
  & {
    [Property in typeof TRACK_STRING_FIELDS[number]]?: string;
  }
  & {
    art?: File;
  };
