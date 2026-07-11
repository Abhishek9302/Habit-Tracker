import { Router } from "express";
import pool from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, h.title as habit_title
       FROM checkins c
       JOIN habits h ON h.id = c.habit_id
       WHERE h.user_id = $1
       ORDER BY c.checkin_date DESC`,
      [req.user!.userId]
    );
    res.json({ checkins: result.rows });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.delete("/:id", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM checkins
       WHERE id = $1 AND habit_id IN (SELECT id FROM habits WHERE user_id = $2)
       RETURNING id`,
      [req.params.id, req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Check-in not found" });
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
