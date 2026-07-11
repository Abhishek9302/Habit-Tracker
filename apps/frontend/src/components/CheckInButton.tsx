"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function CheckInButton({ habitId }: { habitId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await api.habits.checkin(habitId, { checkinDate: new Date().toISOString().split("T")[0] });
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      alert("Check-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-md px-3 py-1 text-xs font-medium text-white transition-colors ${
        done ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
      } disabled:opacity-50`}
    >
      {done ? "Checked In" : loading ? "..." : "Check In"}
    </button>
  );
}
