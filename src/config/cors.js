/**
 * CORS whitelist for local dev + production frontend.
 * Previously hardcoded to only `http://localhost:3000`, which blocked
 * https://www.toolingtrends.com. Add origins here as a one-line change.
 */
export const allowedOrigins = [
  "http://localhost:3000",
  "https://www.toolingtrends.com",
  "https://toolingtrends.com",
];

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`❌ Blocked by CORS: ${origin}`);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
};
