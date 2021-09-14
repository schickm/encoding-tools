import { runCommand } from "../../adapters.ts";
import { File } from "../../models.ts";

const metaflac = (...args: string[]) => runCommand(["metaflac", ...args]);

export interface Metaflac {
  getMeta(file: File, tag: string): Promise<string | undefined>;
  hasArt(file: File): Promise<boolean>;
  getArt(file: File): Promise<File>;
}

const methods: Metaflac = {
  async getMeta(file, tag) {
    const output = await metaflac(
      `--show-tag=${tag}`,
      file.path,
    );

    const firstLine = output.split("\n")[0];

    if (firstLine) {
      const value = firstLine.split("=")[1];

      if (value) {
        return value;
      }
    }
  },
  async hasArt(file: File) {
    const output = await getPictureBlockInfo(file);
    return output ? true : false;
  },

  async getArt(file: File) {
    const tempFile = Deno.makeTempFileSync();
    await metaflac(`--export-picture-to=${tempFile}`, file.path);
    return { path: tempFile, extension: await getArtFileType(file), meta: {} };
  },
};

export default methods;

const getPictureBlockInfo = (file: File) =>
  metaflac("--list", "--block-type=PICTURE", file.path);

const pictureRegex = /MIME type: (\w+)\/(\w+)/;

async function getArtFileType(file: File) {
  const output = await getPictureBlockInfo(file);
  const line = output.split("\n").find((l) => l.match(pictureRegex));

  if (!line) {
    throw new Error(`Could not locate MIME type line within metaflac output`);
  }

  const match = line.match(pictureRegex);

  if (!match) {
    throw new Error(`Could not match Mime type values: $line`);
  }

  const filetype = match[2];

  return filetype;
}
