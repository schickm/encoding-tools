import { execCommand } from "./adapters.ts";

export async function makeTorrent(source: string, announceUrl: string) {
  await execCommand([
    "imdl",
    "torrent",
    "create",
    "--private",
    "--source",
    "RED",
    "--announce",
    announceUrl,
    "--input",
    source,
    "--output",
    `${source}.torrent`,
  ]);
}
