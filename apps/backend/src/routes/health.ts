import { Router } from "express";
import pool from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ status: "ok", db: result.rows.length === 1 ? "up" : "down" });
  } catch (e) {
    res.status(503).json({ status: "error", db: "down", detail: String(e) });
  }
});

export default router;
