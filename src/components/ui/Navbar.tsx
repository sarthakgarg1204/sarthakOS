'use client';

import CalendarPreview from '@/components/util-components/CalendarPreview';
import Clock from '@/components/util-components/Clock';
import Status from '@/components/util-components/Status';
import StatusCard from '@/components/util-components/StatusCard';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface NavbarProps {
  lockScreen: () => void;
  shutDown: () => void;
  openActivities: () => void;
}

export default function Navbar({ lockScreen, shutDown, openActivities }: Readonly<NavbarProps>) {
  const [statusCardVisible, setStatusCardVisible] = useState(false);
  const statusWrapperRef = useRef<HTMLDivElement>(null); // wrapper includes both Status + Card
  const [calendarVisible, setCalendarVisible] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  const handleStatusClick = () => {
    setStatusCardVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clockRef.current && !clockRef.current.contains(e.target as Node)) {
        setCalendarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusWrapperRef.current &&
        !statusWrapperRef.current.contains(event.target as Node)
      ) {
        setStatusCardVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="main-navbar-vp absolute top-0 right-0 w-screen shadow-md flex justify-between items-center bg-ub-grey dark:bg-[#2e2e2e] text-ubt-grey text-sm select-none z-102">
      {/* Activities Button */}
      <button
        type="button"
        tabIndex={0}
        onClick={() => openActivities?.()}
        className="flex items-center gap-2 pl-4 pr-3 py-2 outline-none"
      >
        <div className="w-8 h-2.5 bg-white rounded-full" />
        <div className="w-2.5 h-2.5 bg-white rounded-full" />
      </button>

      {/* Clock with calendar dropdown */}
      <div ref={clockRef} className="relative">
        <button
          type="button"
          tabIndex={0}
          onClick={() => setCalendarVisible((prev) => !prev)}
          className="pl-2 pr-2 py-1 text-xs md:text-sm border-b-2 border-transparent outline-none transition duration-100 ease-in-out focus:border-ubb-orange cursor-pointer"
        >
          <Clock />
        </button>
        {calendarVisible && <CalendarPreview />}
      </div>

      {/* Status Section */}
      <div ref={statusWrapperRef} className="relative">
        <button
          type="button"
          id="status-bar"
          tabIndex={0}
          onClick={handleStatusClick}
          className={clsx(
            'px-1 mx-2 flex items-center gap-1 cursor-pointer transition duration-100 ease-in-out border-b-2 border-transparent',
            statusCardVisible ? 'backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-full my-1 py-0' : 'py-1'
            )}
        >
          <Status />
        </button>

        <StatusCard
          lockScreen={lockScreen}
          shutDown={shutDown}
          visible={statusCardVisible}
          toggleVisible={() => setStatusCardVisible(false)}
        />
      </div>
    </div>
  );
}
