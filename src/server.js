import "./loadEnv.js"; // MUST be first — loads .env before other modules read process.env
import app from "./app.js";
import { prisma } from "./shared/lib/prisma.js";
import { ensurePermissionsSeeded } from "./shared/lib/permissions.js";
import { ensureRolesSeeded } from "./shared/lib/roles.js";

const PORT = process.env.PORT || 5000;

async function connectWithRetry(retries = 5, delayMs = 3000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
      return;
    } catch (err) {
      console.warn(`⏳ Database connection attempt ${attempt}/${retries} failed (${err.message}). Retrying in ${delayMs / 1000}s...`);
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

async function start() {
  try {
    await connectWithRetry();
    await ensurePermissionsSeeded(prisma);
    await ensureRolesSeeded(prisma);

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();

