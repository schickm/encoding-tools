import { execCommand } from "./adapters.ts";

export async function makeTorrent(source: string, announceUrl: string) {
  const torrentFile = `${source}.torrent`;
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
    torrentFile,
  ]);
  return torrentFile;
}
