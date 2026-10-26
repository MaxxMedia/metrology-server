/** Guards Prisma Client generation against Windows engine DLL locks. */
const { spawnSync } = require("node:child_process");

// Postinstall must remain non-fatal when a running Windows app locks the Prisma engine.
const isPostinstall = process.argv.includes("--postinstall");

/** Finds Node processes that have the Windows Prisma query-engine DLL loaded. */
function findPrismaEngineLockHolders() {
  // The generated query-engine DLL lock is specific to Windows; other platforms need no process scan.
  if (process.platform !== "win32") return [];

  const command = String.raw`
$ErrorActionPreference = 'SilentlyContinue'
Get-Process -Name node | ForEach-Object {
  $processId = $_.Id
  try {
    if ($_.Modules.ModuleName -contains 'query_engine-windows.dll.node') {
      "$($processId)|$($_.Path)"
    }
  } catch { }
}`;

  const result = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-Command", command],
    { encoding: "utf8", windowsHide: true }
  );

  if (result.error || result.status !== 0) return [];

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [processId, ...executable] = line.split("|");
      return { processId, executable: executable.join("|") };
    });
}

// Do not attempt to replace Prisma's native engine while a process still has it loaded.
const lockHolders = findPrismaEngineLockHolders();

if (lockHolders.length) {
  const processes = lockHolders
    .map(({ processId, executable }) => `  PID ${processId}: ${executable}`)
    .join("\n");

  // Package installation can continue, but explicit generation should report the lock as a failure.
  if (isPostinstall) {
    console.warn(
      `\nPrisma Client generation was skipped because a running Node process has the Windows Prisma engine loaded:\n${processes}\nStop that app and run "npm run prisma:generate" when you need to regenerate the client.\n`
    );
    process.exit(0);
  }

  console.error(
    `Prisma Client generation cannot replace its Windows engine DLL while these processes are running:\n${processes}\nStop the listed app processes cleanly, then rerun "npm run prisma:generate". No processes were stopped automatically.`
  );
  process.exit(1);
}

// Delegate generation to the local Prisma CLI and preserve its output and exit status.
const prismaCli = require.resolve("prisma/build/index.js");
const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  stdio: "inherit",
  windowsHide: true,
});

if (result.error) {
  console.error("Unable to start Prisma Client generation:", result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
