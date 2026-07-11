"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { CheckInButton } from "./CheckInButton";
import type { Habit } from "@/types";

export function HabitList({ habits, onChange }: { habits: Habit[]; onChange?: (id: string) => void }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this habit?")) return;
    setDeleting(id);
    try {
      await api.habits.remove(id);
      onChange?.(id);
    } catch {
      alert("Failed to delete habit");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-4 w-4 rounded-full"
              style={{ backgroundColor: habit.color || "#3b82f6" }}
            />
            <div>
              <div className="font-medium">{habit.title}</div>
              <div className="text-xs text-gray-500">{habit.frequency}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckInButton habitId={habit.id} />
            <button
              onClick={() => remove(habit.id)}
              disabled={deleting === habit.id}
              className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
