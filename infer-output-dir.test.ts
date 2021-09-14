import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { inferOutputDirFactory } from "./infer-output-dir.ts";

Deno.test("inferOutputDir - it returns adjacent dir if prompt returns yes", async () => {
  const toggle = spy(() => Promise.resolve(true));
  const prompt = spy(() => Promise.resolve("/encoded_music"));
  const inferOutputDir = inferOutputDirFactory(toggle, prompt);

  assertEquals(await inferOutputDir("/music/Foo - Flac"), "/music/Foo - Mp3");
});
