import { assertEquals } from "https://deno.land/std@0.111.0/testing/asserts.ts";
import { assertSpyCalls } from "https://deno.land/x/mock@0.10.1/asserts.ts";
import { spy } from "https://deno.land/x/mock@0.10.1/spy.ts";
import { makePromptCache } from "./prompt-cache.ts";

Deno.test("makePromptCache - returns a function", () => {
  const promptCache = makePromptCache(() => Promise.resolve("aoeu"));
  assertEquals(typeof promptCache, "function");
});

Deno.test("promptCache - resolves to the result of the prompt function", async () => {
  const prompt = () => Promise.resolve("true");
  const promptCache = makePromptCache(prompt);

  const result = await promptCache("Is it true?");

  assertEquals(result, "true");
});

Deno.test("promptCache - it only calls the prompt once for the same message", async () => {
  const prompt = spy(() => Promise.resolve("true"));
  const promptCache = makePromptCache(prompt);

  const firstResult = await promptCache("Is it true?");
  const secondResult = await promptCache("Is it true?");

  assertEquals(firstResult, "true");
  assertEquals(secondResult, "true");
  assertSpyCalls(prompt, 1);
});

Deno.test("promptCache - it correctly caches false return values", async () => {
  const prompt = spy(() => Promise.resolve(false));
  const promptCache = makePromptCache(prompt);

  const firstResult = await promptCache("Is it true?");
  const secondResult = await promptCache("Is it true?");

  assertEquals(firstResult, false);
  assertEquals(secondResult, false);
  assertSpyCalls(prompt, 1);
});
