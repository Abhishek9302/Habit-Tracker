import { Router } from "express";
import pool from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user!.userId]
    );
    res.json({ habits: result.rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const { title, description, frequency, color } = req.body || {};
  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }
  try {
    const result = await pool.query(
      `INSERT INTO habits (user_id, title, description, frequency, color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user!.userId, title, description || null, frequency || "daily", color || null]
    );
    res.status(201).json({ habit: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    res.json({ habit: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.patch("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const { title, description, frequency, color } = req.body || {};
  try {
    const result = await pool.query(
      `UPDATE habits
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           frequency = COALESCE($3, frequency),
           color = COALESCE($4, color),
           updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [title, description, frequency, color, req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    res.json({ habit: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id",
      [req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.get("/:id/checkins", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const habit = await pool.query(
      "SELECT id FROM habits WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user!.userId]
    );
    if (habit.rows.length === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    const result = await pool.query(
      "SELECT * FROM checkins WHERE habit_id = $1 ORDER BY checkin_date DESC",
      [req.params.id]
    );
    res.json({ checkins: result.rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/:id/checkins", authMiddleware, async (req: AuthRequest, res) => {
  const { checkinDate, note } = req.body || {};
  try {
    const habit = await pool.query(
      "SELECT id FROM habits WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user!.userId]
    );
    if (habit.rows.length === 0) {
      res.status(404).json({ error: "Habit not found" });
      return;
    }
    const date = checkinDate ? new Date(checkinDate) : new Date();
    const result = await pool.query(
      `INSERT INTO checkins (habit_id, checkin_date, note)
       VALUES ($1, $2, $3)
       ON CONFLICT (habit_id, checkin_date) DO UPDATE SET note = EXCLUDED.note
       RETURNING *`,
      [req.params.id, date.toISOString().split("T")[0], note || null]
    );
    res.status(201).json({ checkin: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
