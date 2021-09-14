// The following are learning tests.  These actually exercise real system
// things.  These should only be enabled when needing to validate external
// parts of the system that the adapters abstract.
const LEARNING_TESTS = Deno.env.get("LEARNING_TESTS");
const SKIP_LEARNING_TESTS = !LEARNING_TESTS || LEARNING_TESTS === "false";

export const learningTest = (name: string, fn: () => void | Promise<void>) =>
  Deno.test({
    name,
    ignore: SKIP_LEARNING_TESTS,
    fn,
  });
