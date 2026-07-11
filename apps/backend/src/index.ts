import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import pool from "./lib/prisma";

import authRouter from "./routes/auth";
import habitsRouter from "./routes/habits";
import checkinsRouter from "./routes/checkins";
import healthRouter from "./routes/health";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || "8080");

const allowed = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowed.length ? allowed : true,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/habits", habitsRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/health", healthRouter);

async function initSchema() {
  const candidates = [
    path.join(__dirname, "../../database/schema.sql"),
    path.join(__dirname, "../../../database/schema.sql"),
    path.join(process.cwd(), "database/schema.sql"),
  ];
  let schemaPath: string | null = null;
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      schemaPath = p;
      break;
    }
  }
  if (!schemaPath) {
    console.warn("schema.sql not found; skipping schema init");
    return;
  }
  const sql = fs.readFileSync(schemaPath, "utf-8");
  await pool.query(sql);
  console.log("Schema applied from", schemaPath);
}

async function main() {
  await initSchema();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend listening on 0.0.0.0:${PORT}`);
  });
}

main().catch((e) => {
  console.error("Startup error:", e);
  process.exit(1);
});
