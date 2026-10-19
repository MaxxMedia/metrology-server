const { spawnSync } = require("node:child_process");

const isPostinstall = process.argv.includes("--postinstall");

function findPrismaEngineLockHolders() {
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

const lockHolders = findPrismaEngineLockHolders();

if (lockHolders.length) {
  const processes = lockHolders
    .map(({ processId, executable }) => `  PID ${processId}: ${executable}`)
    .join("\n");

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
