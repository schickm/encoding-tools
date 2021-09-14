export const withTempDir = (
  func: (tempDir: string) => void | Promise<void>,
) => {
  return async () => {
    const outputDir = Deno.makeTempDirSync();
    try {
      return await func(outputDir);
    } finally {
      Deno.removeSync(outputDir, { recursive: true });
    }
  };
};

export const withTempFilePath = (
  func: (tempFilePath: string) => void | Promise<void>,
) => {
  return async () => {
    const file = Deno.makeTempFileSync();
    try {
      return await func(file);
    } finally {
      Deno.removeSync(file);
    }
  };
};
