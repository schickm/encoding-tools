export type RunCommand = (
  cmd: string[],
) => Promise<string>;

export const runCommand: RunCommand = async function (
  cmd,
) {
  const p = Deno.run({
    cmd,
    stderr: "piped",
    stdout: "piped",
  });
  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);

  verifyStatus(status, cmd, stderr);

  p.close();

  return new TextDecoder().decode(stdout);
};

export async function execCommand(cmd: string[]) {
  const p = Deno.run({
    cmd,
    stderr: "piped",
    stdout: "null",
  });
  const [status, stderr] = await Promise.all([
    p.status(),
    p.stderrOutput(),
  ]);

  verifyStatus(status, cmd, stderr);

  p.close();
}

function verifyStatus(
  status: Deno.ProcessStatus,
  cmd: string[],
  stderr: Uint8Array,
) {
  if (!status.success) {
    const err = new TextDecoder().decode(stderr);
    throw new Error(
      `External command failed
  command: ${JSON.stringify(cmd)}
  stderr:  ${err}`,
    );
  }
}
