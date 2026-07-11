import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "change-me-in-production";

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as { userId: string; email: string };
}
