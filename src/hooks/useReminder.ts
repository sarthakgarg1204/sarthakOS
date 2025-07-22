// hooks/useReminder.ts

import { CalendarEvent } from "@/components/types/calendarTypes";
import { showEventNotification } from "@/components/utils/notification";
import dayjs from "dayjs";
import { useEffect } from "react";

export function useReminder(events: CalendarEvent[], minutesBefore = 5) {
  useEffect(() => {
    const checkReminders = () => {
      const now = dayjs();
      const soon = now.add(minutesBefore, "minute");

      events.forEach((event) => {
        const eventTime = dayjs(event.date);

        if (
          eventTime.isAfter(now) &&
          eventTime.isBefore(soon) &&
          !localStorage.getItem(`reminded-${event.id}`)
        ) {
          showEventNotification(event);
          localStorage.setItem(`reminded-${event.id}`, "true");
        }
      });
    };

    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, [events, minutesBefore]);
}
