"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { HabitList } from "@/components/HabitList";
import type { Habit } from "@/types";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.habits
      .list()
      .then((data) => setHabits(data.habits || []))
      .catch(() => setHabits([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.name || user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/habits"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Habit
          </Link>
          <button
            onClick={logout}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Total Habits</div>
          <div className="text-2xl font-bold">{habits.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-sm text-gray-500">Today</div>
          <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your Habits</h2>
          <Link href="/history" className="text-sm text-blue-600 hover:underline">
            History
          </Link>
        </div>
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : habits.length === 0 ? (
          <div className="text-sm text-gray-500">
            No habits yet.{" "}
            <Link href="/habits" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </div>
        ) : (
          <HabitList habits={habits} onChange={(id) => setHabits(habits.filter((h) => h.id !== id))} />
        )}
      </div>
    </div>
  );
}
