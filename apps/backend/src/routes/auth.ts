import { Router } from "express";
import pool from "../lib/prisma";
import { hashPassword, comparePassword } from "../lib/password";
import { signToken } from "../lib/jwt";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const hashed = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at",
      [email, hashed, name || null]
    );
    const user = result.rows[0];
    const token = signToken({ userId: user.id, email: user.email });
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, name FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];
    if (!user || !(await comparePassword(password, user.password_hash))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken({ userId: user.id, email: user.email });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ ok: true });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, created_at FROM users WHERE id = $1",
      [req.user!.userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user: result.rows[0] });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

export default router;
