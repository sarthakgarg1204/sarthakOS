'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  title: string;
  icon: string;
  isClose?: boolean;
  isFocus?: boolean;
  isMinimized?: boolean;
  isOpenInAnotherWorkspace?: boolean;
  handleClick: () => void;
};

export default function SideBarApp({
  title,
  icon,
  isClose = true,
  isFocus = false,
  isMinimized = false,
  isOpenInAnotherWorkspace = false,
  handleClick,
}: Readonly<Props>) {
  const [hovered, setHovered] = useState(false);

  const showDot = !isClose || isOpenInAnotherWorkspace;

  let dotColorClass = '';
  if (isOpenInAnotherWorkspace) {
    dotColorClass = 'bg-gray-400 opacity-70';
  } else if (isFocus && !isMinimized) {
    dotColorClass = 'bg-orange-400 shadow-md';
  } else if (!isClose && isMinimized) {
    dotColorClass = 'bg-gray-400';
  } else if (!isClose && !isFocus && !isMinimized) {
    dotColorClass = 'bg-orange-400';
  }

  return (
    <div className="relative group mt-2">
      <button
        tabIndex={0}
        aria-label={title}
        className={cn(
          'w-10 h-10 flex items-center justify-center cursor-pointer rounded transition-all duration-150',
          (hovered || ((isFocus && !isMinimized) && !isOpenInAnotherWorkspace)) && 'bg-white/20 backdrop-blur-sm'
        )}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Indicator Dot */}
        {showDot && (
          <div
            className={cn(
              'absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full',
              dotColorClass
            )}
          />
        )}

        {/* App Icon */}
        <Image
          src={icon}
          alt={title}
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
        />
      </button>
    </div>
  );
}
