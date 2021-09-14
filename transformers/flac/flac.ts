import { File } from "../../models.ts";

export interface Flac {
  decode(file: File, destination: string): Promise<void>;
}

const methods: Flac = {
  async decode(file, destination) {
    const cmd = [
      "flac",
      "-s",
      "--force",
      "--decode",
      "--output-name",
      destination,
      file.path,
    ];
    const process = Deno.run({
      cmd,
      stderr: "piped",
    });

    const error = new TextDecoder().decode(await process.stderrOutput());
    const status = await process.status();

    if (!status.success) {
      throw new Error(`Call to flac failed...
call: ${cmd.map((v) => JSON.stringify(v)).join(" ")}
error: ${error}`);
    }

    process.close();
  },
};

export default methods;
