"use client";

import type { Habit, Checkin } from "@/types";

function getMonthDays(year: number, month: number) {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function HabitCalendar({ habit, checkins }: { habit: Habit; checkins: Checkin[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = getMonthDays(year, month);
  const checked = new Set(checkins.map((c) => c.checkin_date));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const startOffset = days[0].getDay();

  return (
    <div>
      <div className="text-sm font-medium text-gray-700 mb-2">
        {now.toLocaleString("default", { month: "long" })} {year}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-gray-500">
            {d}
          </div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const iso = day.toISOString().split("T")[0];
          const isChecked = checked.has(iso);
          return (
            <div
              key={iso}
              className={`aspect-square rounded-md flex items-center justify-center text-xs border ${
                isChecked
                  ? "border-transparent text-white"
                  : "border-gray-200 text-gray-700 bg-white"
              }`}
              style={{ backgroundColor: isChecked ? habit.color || "#3b82f6" : undefined }}
              title={iso}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
