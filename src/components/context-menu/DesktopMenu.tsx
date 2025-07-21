'use client';

import ThemedBox from '@/components/ui/ThemedBox';
import useMounted from '@/hooks/useMounted';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type Props = {
  active: boolean;
  openApp: (appName: string) => void;
  addNewFolder: () => void;
  position: { x: number; y: number };
};

type MenuItemObject = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

type MenuItemType = MenuItemObject | 'divider';

export default function DesktopMenu({
  active,
  openApp,
  addNewFolder,
  position,
}: Readonly<Props>) {
  const mounted = useMounted();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    document.addEventListener('fullscreenchange', checkFullScreen);
    return () => document.removeEventListener('fullscreenchange', checkFullScreen);
  }, []);

  const checkFullScreen = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };

  const toggleFullScreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  };

  const menuItems: MenuItemType[] = [
    { label: 'New Folder', onClick: addNewFolder },
    'divider',
    { label: 'Paste', disabled: true },
    'divider',
    { label: 'Show Desktop in Files', disabled: true },
    { label: 'Open in Terminal', onClick: () => openApp('terminal') },
    'divider',
    { label: 'Change Background…', onClick: () => openApp('settings') },
    'divider',
    { label: 'Display Settings', disabled: true },
    { label: 'Settings', onClick: () => openApp('settings') },
    'divider',
    {
      label: `${isFullScreen ? 'Exit Full Screen Mode' : 'Enter Full Screen Mode'}`,
      onClick: toggleFullScreen,
    },
  ];

  if (!mounted || !active) return null;

  return (
    <ThemedBox
      className={clsx(
        'absolute z-50 w-56 rounded-md py-2 font-normal text-[13px] leading-5 shadow-lg transition-all',
        'font-[Ubuntu, sans-serif]'
      )}
      lightClassName="bg-white text-black border border-gray-300"
      darkClassName="bg-[#1a1a1a] text-white border border-white/10"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      {menuItems.map((item) => {
        if(item === 'divider') {
          return <Divider key={item} />;
        } else {
            return <MenuItem key={item.label} {...item} />;
        }
      })}
    </ThemedBox>
  );
}

function MenuItem({
  label,
  onClick,
  disabled = false,
}: Readonly<{
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}>) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={clsx(
        'w-full px-3 py-1.5 rounded-sm transition',
        disabled
          ? 'text-gray-400 cursor-not-allowed'
          : 'hover:bg-orange-500/10 hover:text-orange-500 cursor-pointer'
      )}
    >
      <span className="pl-5">{label}</span>
    </button>
  );
}

function Divider() {
  return (
    <div className="my-1 px-3">
      <div className="h-px w-full bg-gray-300 dark:bg-white/10" />
    </div>
  );
}
