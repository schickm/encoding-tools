import { File, MetaData } from "../../models.ts";

export interface Lame {
  encode(file: File, destination: string): Promise<void>;
}

const methods: Lame = {
  async encode(file, destination) {
    const cmd = [
      "lame",
      "-V0",
      "--vbr-new",
      "--add-id3v2",
      ...(file.meta ? metaToArgs(file.meta) : []),
      file.path,
      destination,
    ];

    const process = Deno.run({
      cmd,
      stderr: "piped",
      stdout: "null",
    });

    const error = new TextDecoder().decode(await process.stderrOutput());
    const status = await process.status();

    if (!status.success) {
      throw new Error(`Call to lame failed:
cmd: ${cmd.map((x) => JSON.stringify(x)).join(" ")}
error: ${error}
track meta: ${JSON.stringify(file.meta)}`);
    }

    process.close();
  },
};

function metaToArgs(m: MetaData) {
  return [
    ...[m.title && ["--tt", m.title]],
    ...[m.artist && ["--ta", m.artist]],
    ...[m.album && ["--tl", m.album]],
    ...[m.year && ["--ty", m.year]],
    ...[m.tracknumber && ["--tn", m.tracknumber]],
    ...[m.genre && ["--tg", m.genre]],
    ...[m.art && ["--ti", m.art.path]],
    ...[m.albumartist && ["--tv", `TPE2=${m.albumartist}`]],
  ].flat().filter(isString);
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

export default methods;
