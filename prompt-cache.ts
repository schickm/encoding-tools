import { makeRunWithLimit } from "https://denopkg.com/alextes/run-with-limit@v1.0.1/mod.ts";

type AnswerCache<T> = {
  [k: string]: T;
};

export function makePromptCache<T>(prompt: (message: string) => Promise<T>) {
  const { runWithLimit } = makeRunWithLimit<T>(1);
  const cache: AnswerCache<T> = {};
  return (message: string) =>
    runWithLimit(async () => {
      if (!cache.hasOwnProperty(message)) {
        cache[message] = await prompt(message);
      }
      return cache[message];
    });
}
