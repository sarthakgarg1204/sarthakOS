"use client";

import ThemedBox from "@/components/ui/ThemedBox";
import clsx from "clsx";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function CalendarPreview() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [visible, setVisible] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Sync with localStorage theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
    } else {
      setIsDark(true);
    }
  }, []);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week").add(1, "day"); // Start from Monday
  const endDate = endOfMonth.endOf("week").add(1, "day");

  const today = dayjs();
  const days = [];
  let date = startDate;

  while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
    days.push(date);
    date = date.add(1, "day");
  }

  const isToday = (d: dayjs.Dayjs) => d.isSame(today, "day");
  const isCurrentMonth = (d: dayjs.Dayjs) => d.month() === currentDate.month();

  const openCalendarApp = () => {
    window.dispatchEvent(new CustomEvent("launchApp", { detail: "calendar" }));
    setVisible(false); // Hide preview
  };

  const getDayClass = (isToday: boolean, isCurrent: boolean, dark: boolean) => {
    if (isToday) {
      return dark
        ? "bg-orange-500 text-white font-bold"
        : "bg-orange-500 text-black font-bold";
    }

    if (isCurrent) {
      return dark
        ? "text-white hover:bg-orange-500 hover:text-white"
        : "text-gray-900 hover:bg-orange-500 hover:text-white";
    }

    return dark
      ? "text-gray-500 hover:bg-orange-400 hover:text-white"
      : "text-gray-400 hover:bg-orange-200 hover:text-black";
  };

  if (!visible) return null;

  return (
    <ThemedBox
      className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 rounded-xl border shadow-xl p-4 z-50 text-sm backdrop-blur-md"
      lightClassName="bg-white border-gray-300"
      darkClassName="bg-[#1c1c1c] border-white/20"
    >
      {/* Header */}
      <div className="relative flex items-center justify-between mb-4 text-sm">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className={clsx(
            "hover:text-orange-500 transition",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
        >
          <ChevronLeft size={16} />
        </button>
        <span
          className={clsx(
            "absolute left-1/2 -translate-x-1/2 font-semibold",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          {currentDate.format("MMMM YYYY")}
        </span>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className={clsx(
            "hover:text-orange-500 transition",
            isDark ? "text-gray-300" : "text-gray-600"
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekdays */}
      <div
        className={clsx(
          "grid grid-cols-7 text-center text-xs mb-1 font-medium",
          isDark ? "text-gray-400" : "text-gray-500"
        )}
      >
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
          <div key={`${d}-${i}`}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-[2px] text-center">
        {days.map((day) => {
          const isDayToday = isToday(day);
          const isDayCurrent = isCurrentMonth(day);

          return (
            <button
              key={day.format("YYYY-MM-DD")}
              onClick={openCalendarApp}
              className={clsx(
                "w-7 h-7 rounded-full flex items-center justify-center text-sm select-none transition",
                getDayClass(isDayToday, isDayCurrent, isDark)
              )}
            >
              {day.date()}
            </button>
          );
        })}
      </div>
    </ThemedBox>
  );
}
