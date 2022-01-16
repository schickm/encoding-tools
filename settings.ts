import { z } from "https://deno.land/x/zod@v3.11.6/mod.ts";
import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.106.0/path/mod.ts";

const settingsPath = join(
  dirname(fromFileUrl(import.meta.url)),
  "settings.json",
);

const values = Deno.readTextFileSync(settingsPath);

const settings = z.object({
  announceUrl: z.string(),
  scpMedia: z.string(),
  scpTorrent: z.string(),
})
  .parse(JSON.parse(values));

export default settings;
