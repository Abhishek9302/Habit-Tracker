"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { HabitCalendar } from "@/components/HabitCalendar";
import type { Checkin, Habit } from "@/types";

export default function HistoryPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.habits.list(), api.checkins.list()])
      .then(([h, c]) => {
        setHabits(h.habits || []);
        setCheckins(c.checkins || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
      <h1 className="text-2xl font-semibold mb-4">History</h1>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : habits.length === 0 ? (
        <div className="text-sm text-gray-500">No habits yet.</div>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2" style={{ color: habit.color || "#111827" }}>
                {habit.title}
              </h2>
              <HabitCalendar habit={habit} checkins={checkins.filter((c) => c.habit_id === habit.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
