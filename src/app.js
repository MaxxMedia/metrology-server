import "./loadEnv.js"; // MUST be the very first import — loads .env
import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { mountRoutes } from "./routes/index.js";

const app = express();

app.use(cors(corsOptions));
// Explicitly handle preflight (OPTIONS) for every route (Render / Railway proxies).
app.options("/{*splat}", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "✅ Newsprk backend running" });
});

app.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().rss,
      timestamp: new Date(),
    });
  } catch {
    res.status(500).json({ status: "error" });
  }
});

mountRoutes(app);

export default app;
