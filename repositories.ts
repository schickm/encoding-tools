import { resolve } from "https://deno.land/std@0.106.0/path/mod.ts";
import { makeFile } from "./models.ts";

export function* fileRepository(
  directory: string,
  files: { isFile: boolean; name: string }[],
) {
  for (const dirEntry of files) {
    if (dirEntry.isFile) {
      const absPath = resolve(directory, dirEntry.name);
      yield makeFile(absPath);
    }
  }
}
