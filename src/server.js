import "./loadEnv.js"; // MUST be first — loads .env before other modules read process.env
import app from "./app.js";
import { prisma } from "./shared/lib/prisma.js";
import { ensurePermissionsSeeded } from "./shared/lib/permissions.js";
import { ensureRolesSeeded } from "./shared/lib/roles.js";

const PORT = process.env.PORT;

async function start() {
  await ensurePermissionsSeeded(prisma);
  await ensureRolesSeeded(prisma);

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

start();
