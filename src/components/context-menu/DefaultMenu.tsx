'use client';

import ThemedBox from '@/components/ui/ThemedBox';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

type Props = {
  active: boolean;
  position: { x: number; y: number };
  onReset?: () => void;
};

export default function DefaultMenu({ active, position, onReset }: Readonly<Props>) {
  const [menuPos, setMenuPos] = useState(position);

  useEffect(() => {
    if (!active) return;

    const menuWidth = 208;
    const menuHeight = 280;
    const padding = 8;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = position.x;
    let y = position.y;

    if (x + menuWidth > windowWidth - padding) {
      x = windowWidth - menuWidth - padding;
    }
    if (y + menuHeight > windowHeight - padding) {
      y = windowHeight - menuHeight - padding;
    }

    setMenuPos({ x, y });
  }, [position, active]);

  if (!active) return null;

  return (
    <ThemedBox
      className={clsx(
        'absolute z-50 w-52 py-3 px-1 rounded-[8px] shadow-xl font-ubuntu text-sm select-none',
        'transition-opacity duration-200 border backdrop-blur-md'
      )}
      lightClassName="bg-white/80 text-black border-gray-300"
      darkClassName="bg-[#1c1c1c]/90 text-white border-zinc-800"
      style={{
        top: `${menuPos.y}px`,
        left: `${menuPos.x}px`,
      }}
    >
      <MenuLink
        icon="🌟"
        label="Star this Project"
        href="https://github.com/sarthakgarg1204/sarthakgarg1204.github.io"
      />
      <MenuLink
        icon="❗"
        label="Report bugs"
        href="https://github.com/sarthakgarg1204/sarthakgarg1204.github.io/issues"
      />
      <Divider />
      <MenuLink
        icon="🙋‍♂️"
        label="Follow on LinkedIn"
        href="https://www.linkedin.com/in/sarthakgarg1204/"
      />
      <MenuLink
        icon="🤝"
        label="Follow on GitHub"
        href="https://github.com/sarthakgarg1204"
      />
      <MenuLink
        icon="📥"
        label="Contact Me"
        href="mailto:sarthakgarg7124@gmail.com"
      />
      <Divider />
      <button
        onClick={() => {
          if (onReset) onReset();
          else {
            localStorage.clear();
            window.location.reload();
          }
        }}
        className={clsx(
          'flex items-center gap-2 px-4 py-[6px] rounded-sm',
          'cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-150'
        )}
      >
        <span>🧹</span>
        <span>Reset Ubuntu</span>
      </button>
    </ThemedBox>
  );
}

function MenuLink({
  icon,
  label,
  href,
}: Readonly<{
  icon: string;
  label: string;
  href: string;
}>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={clsx(
        'flex items-center gap-2 px-4 py-[6px] rounded-sm',
        'hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-150'
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </a>
  );
}

function Divider() {
  return (
    <div className="w-full flex justify-center my-[6px]">
      <div className="border-t border-gray-300 dark:border-gray-700 w-[80%]" />
    </div>
  );
}
