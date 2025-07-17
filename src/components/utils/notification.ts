// utils/notification.ts

import dayjs from 'dayjs';
import { CalendarEvent } from '../types/calendarTypes';

// Request permission once
export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    try {
      await Notification.requestPermission();
    } catch {
      console.warn('Notification permission denied');
    }
  }
};

// Trigger notification immediately
export const showEventNotification = (event: CalendarEvent) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`📅 ${event.title}`, {
      body: `Today - ${dayjs(event.date).format('DD MMM YYYY')} (${event.category})`,
      icon: '/icons/calendar.png', // optional: add a calendar icon
    });
  }
};

// Schedule reminder (e.g., show if event is today)
export const notifyTodayEvents = (events: CalendarEvent[]) => {
  const today = dayjs().startOf('day');
  const upcoming = events.filter((e) =>
    dayjs(e.date).isSame(today, 'day')
  );

  upcoming.forEach(showEventNotification);
};
