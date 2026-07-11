const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function fetchJson(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name?: string }) =>
      fetchJson("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      fetchJson("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
    logout: () => fetchJson("/api/auth/logout", { method: "POST" }),
    me: () => fetchJson("/api/auth/me"),
  },
  habits: {
    list: () => fetchJson("/api/habits"),
    create: (body: Partial<Habit>) => fetchJson("/api/habits", { method: "POST", body: JSON.stringify(body) }),
    get: (id: string) => fetchJson(`/api/habits/${id}`),
    update: (id: string, body: Partial<Habit>) =>
      fetchJson(`/api/habits/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
    remove: (id: string) => fetchJson(`/api/habits/${id}`, { method: "DELETE" }),
    checkins: (id: string) => fetchJson(`/api/habits/${id}/checkins`),
    checkin: (id: string, body: { checkinDate?: string; note?: string }) =>
      fetchJson(`/api/habits/${id}/checkins`, { method: "POST", body: JSON.stringify(body) }),
  },
  checkins: {
    list: () => fetchJson("/api/checkins"),
    remove: (id: string) => fetchJson(`/api/checkins/${id}`, { method: "DELETE" }),
  },
};

import type { Habit } from "../types";
