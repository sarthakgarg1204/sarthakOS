"use client";

import * as CategoryUtils from "@/components/constants/categories";
import type { CalendarEvent } from "@/components/types/calendarTypes";
import ThemedBox from "@/components/ui/ThemedBox";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useReminder } from "@/hooks/useReminder";

import clsx from "clsx";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", { weekStart: 1 });

export default function CalendarApp() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventCategory, setEventCategory] =
    useState<CalendarEvent["category"]>("Work");
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "agenda">("month");
  const [searchQuery, setSearchQuery] = useState("");

  const emptyEvents: CalendarEvent[] = useMemo(() => [], []);
  const [events, setEvents] = useLocalStorage(
    "ubuntu-calendar-events",
    emptyEvents
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useReminder(events);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight")
        setCurrentMonth((prev) => prev.add(1, "month"));
      if (e.key === "ArrowLeft")
        setCurrentMonth((prev) => prev.subtract(1, "month"));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [events, selectedDate]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node))
        closeModal();
    };
    if (selectedDate) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedDate]);

  const closeModal = () => {
    setSelectedDate(null);
    setEditingEventId(null);
    setEventTitle("");
    setEventTime("");
    setEventCategory("Work");
  };

  const formatTime = (text: string, date: string) => {
    const match = text.match(/^\[(\d{2}:\d{2})\]/);
    if (!match) return "All Day";
    return dayjs(`${date}T${match[1]}`).format("h:mm A");
  };

  const today = dayjs();
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.weekday(0);
  const endDate = endOfMonth.endOf("week");

  const days = [];
  let date = startDate;
  while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
    days.push(date);
    date = date.add(1, "day");
  }

  const getEventsForDate = (d: string) =>
    events.filter((e) => dayjs(e.date).isSame(dayjs(d), "day"));

  const filteredEvents = searchQuery
    ? events.filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  const addOrUpdateEvent = () => {
    if (!eventTitle.trim() || !selectedDate) return;
    const timePrefix = eventTime ? `[${eventTime}] ` : "";
    const finalTitle = timePrefix + eventTitle.trim();

    if (editingEventId) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEventId
            ? { ...e, title: finalTitle, category: eventCategory }
            : e
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: uuidv4(),
        date: selectedDate,
        title: finalTitle,
        category: eventCategory,
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    closeModal();
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingEventId === id) closeModal();
  };

  const startEdit = (event: CalendarEvent) => {
    setSelectedDate(event.date);
    const match = event.title.match(/^\[(\d{2}:\d{2})\]\s?(.*)$/);
    if (match) {
      setEventTime(match[1]);
      setEventTitle(match[2]);
    } else {
      setEventTime("");
      setEventTitle(event.title);
    }
    setEventCategory(event.category);
    setEditingEventId(event.id);
  };

  return (
    <ThemedBox
      className="w-full h-full p-4 font-sans select-none overflow-y-auto"
      lightClassName="bg-white text-ub-dark"
      darkClassName="bg-ub-bg text-ub-light"
    >
      <div ref={scrollRef}>
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center space-x-2 text-ub-orange">
            <button
              onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            >
              ←
            </button>
            <h2 className="text-lg font-bold tracking-wide">
              {currentMonth.format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            >
              →
            </button>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === "agenda" && (
              <input
                type="text"
                placeholder="🔍 Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  "text-sm px-2 py-1 w-44 rounded focus:outline-none transition",
                  "placeholder:text-ub-muted",
                  "bg-gray-100 text-ub-dark",
                  "dark:bg-ub-card dark:text-ub-light"
                )}
              />
            )}
            <button
              onClick={() => setViewMode("month")}
              className={clsx(
                "px-3 py-1 rounded font-medium transition",
                viewMode === "month"
                  ? "bg-ub-orange text-ub-dark"
                  : "bg-ub-card text-ub-light hover:bg-ub-hover"
              )}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={clsx(
                "px-3 py-1 rounded font-medium transition",
                viewMode === "agenda"
                  ? "bg-ub-orange text-ub-dark"
                  : "bg-ub-card text-ub-light hover:bg-ub-hover"
              )}
            >
              Agenda
            </button>
          </div>
        </div>

        {/* Month View */}
        {viewMode === "month" ? (
          <>
            <div className="grid grid-cols-7 text-center text-sm text-ub-muted mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day) => {
                const isToday = day.isSame(today, "day");
                const isCurrentMonth = day.month() === currentMonth.month();
                const dailyEvents = getEventsForDate(day.format("YYYY-MM-DD"));

                return (
                  <div
                    key={day.format("YYYY-MM-DD")}
                    onClick={() => {
                      setSelectedDate(day.format("YYYY-MM-DD"));
                      setEditingEventId(null);
                      setEventTitle("");
                      setEventTime("");
                      setEventCategory("Work");
                    }}
                    className={clsx(
                      "rounded-md p-2 cursor-pointer transition relative text-left border border-transparent",
                      isToday && "border border-ub-orange",
                      !isCurrentMonth && "text-ub-muted",
                      "hover:bg-gray-800 hover:text-white dark:hover:bg-ub-hover dark:hover:text-ub-light"
                    )}
                  >
                    <div className="font-semibold mb-1">{day.date()}</div>
                    {dailyEvents.map((event) => (
                      <div
                        key={event.id}
                        className={clsx(
                          "truncate text-xs px-1 py-0.5 mb-0.5 rounded cursor-pointer",
                          CategoryUtils.getCategoryColor(event.category)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(event);
                        }}
                      >
                        {formatTime(event.title, event.date)} –{" "}
                        {event.title.replace(/\[.*?\]\s?/, "")}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-sm space-y-4">
            {filteredEvents.length === 0 ? (
              <p className="text-ub-muted">No matching events.</p>
            ) : (
              Object.entries(
                filteredEvents
                  .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix())
                  .reduce((acc, event) => {
                    const dateKey = dayjs(event.date).format(
                      "dddd, DD MMM YYYY"
                    );
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(event);
                    return acc;
                  }, {} as Record<string, CalendarEvent[]>)
              ).map(([dateLabel, events]) => (
                <div key={dateLabel}>
                  <div className="text-ub-orange font-semibold text-base mb-2">
                    {dateLabel}
                  </div>
                  <div className="space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="flex justify-between items-center p-3 rounded-lg border border-ub-border transition
                                   bg-gray-100 dark:bg-ub-card dark:text-ub-light dark:hover:bg-ub-hover hover:bg-gray-200"
                      >
                        <div className="space-y-1">
                          <div className="text-sm font-semibold">
                            {event.title.replace(/\[.*?\]\s?/, "")}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-ub-muted">
                            {formatTime(event.title, event.date)}
                            <span
                              className={`ml-2 px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${CategoryUtils.getCategoryColor(
                                event.category
                              )}`}
                            >
                              {event.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => startEdit(event)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-500 hover:text-red-400"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {selectedDate && (
          <div
            ref={modalRef}
            className="absolute right-4 top-20 bg-ub-card p-4 rounded-lg shadow-lg w-72 border border-ub-border z-50"
          >
            <h3 className="text-ub-orange text-sm mb-2 font-semibold">
              {editingEventId ? "Edit" : "Add"} Event –{" "}
              {dayjs(selectedDate).format("DD MMM YYYY")}
            </h3>

            <input
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              type="time"
              className="w-full text-sm p-1 rounded bg-ub-bg bg-opacity-50 text-white outline-none mb-2"
            />
            <input
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Event Title"
              className="w-full text-sm p-1 rounded bg-ub-bg bg-opacity-50 text-ub-light outline-none mb-2"
            />
            <select
              value={eventCategory}
              onChange={(e) =>
                setEventCategory(e.target.value as CalendarEvent["category"])
              }
              className="w-full text-sm p-1 rounded bg-ub-bg bg-opacity-50 text-ub-light outline-none mb-2"
            >
              {CategoryUtils.CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={addOrUpdateEvent}
              className="mt-1 w-full py-1 bg-ub-orange text-ub-dark text-sm rounded hover:opacity-90"
            >
              {editingEventId ? "Save Changes" : "Add Event"}
            </button>
          </div>
        )}
      </div>
    </ThemedBox>
  );
}
