'use client';

import { useEffect, useState } from 'react';

const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ClockProps = {
  onlyTime?: boolean;
  onlyDay?: boolean;
};

export default function Clock({ onlyTime, onlyDay }: Readonly<ClockProps>) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // update every 10s
    return () => clearInterval(timer); // cleanup
  }, []);

  const day = dayList[currentTime.getDay()];
  let hour: string | number = currentTime.getHours();
  let minute: string | number = currentTime.getMinutes();
  const month = monthList[currentTime.getMonth()];
  const date = currentTime.getDate();
  const meridiem = hour < 12 ? "AM" : "PM";

  // Format hour and minute
  if (minute < 10) minute = "0" + minute;
  if (hour > 12) hour = hour - 12;
  if (hour < 10) hour = "0" + hour;

  // Final display string
  let display;
  if (onlyTime) {
    display = `${hour}:${minute} ${meridiem}`;
  } else if (onlyDay) {
    display = `${day} ${month} ${date}`;
  } else {
    display = `${day} ${month} ${date} ${hour}:${minute} ${meridiem}`;
  }

  return (
    <span className="font-mono text-sm md:text-base text-gray-800 dark:text-gray-200">
      {display}
    </span>
  )
}
