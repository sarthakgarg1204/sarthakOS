'use client';

import ThemedBox from '@/components/ui/ThemedBox';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type WindowPreview = {
  id: string;
  title: string;
  icon: string;
};

type ActivitiesProps = {
  show: boolean;
  onClose: () => void;
  openWindowsPerWorkspace: WindowPreview[][];
  currentWorkspace: number;
  setCurrentWorkspace: (i: number) => void;
  wallpaper: string;
  className?: string;
};

export default function Activities({
  show,
  onClose,
  openWindowsPerWorkspace,
  currentWorkspace,
  setCurrentWorkspace,
  wallpaper,
  className,
}: Readonly<ActivitiesProps>) {
  const [searchQuery, setSearchQuery] = useState('');
  let scale: number;
  let columns: number;

  const filteredWindows = useMemo(() => {
    const openWindows = openWindowsPerWorkspace[currentWorkspace] || [];
    if (!searchQuery.trim()) return openWindows;
    return openWindows.filter((win) =>
      win.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, openWindowsPerWorkspace, currentWorkspace]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleAppClick = (appId: string) => {
    window.dispatchEvent(new CustomEvent('focusWindow', { detail: appId }));
    onClose();
  };

  const handleAppClose = (id: string) => {
    window.dispatchEvent(new CustomEvent('closeWindow', { detail: id }));
  };

  const renderWorkspacePreview = (
    windows: WindowPreview[],
    isDimmed = false,
    dimmedPosition: 'left' | 'right' | null = null
  ) => {
    if (isDimmed) {
      // Show only the wallpaper background for peek previews
let backgroundPosition: string;

if (dimmedPosition === 'left') {
  backgroundPosition = 'right center';
} else if (dimmedPosition === 'right') {
  backgroundPosition = 'left center';
} else {
  backgroundPosition = 'center';
}


      return (
        <div
          className={clsx(
            'relative rounded-xl border border-white/10 overflow-hidden w-full h-full',
            'flex items-center justify-center scale-[0.9]'
          )}
          style={{
            backgroundImage: `url(${wallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition,
            filter: 'brightness(0.7)',
          }}
        />
      );
    }

    const total = windows.length;
    if (total === 1) columns = 1;
    else if (total <= 4) columns = 2;
    else if (total <= 9) columns = 3;
    else columns = 4;

    const baseWidth = 900;
    const baseHeight = 600;

if (total === 1) scale = 0.65;
else if (total === 2) scale = 0.5;
else if (total <= 6) scale = 0.35;
else if (total <= 9) scale = 0.25;
else scale = 0.2;


    const fakeWidth = baseWidth * scale;
    const fakeHeight = baseHeight * scale;

    const rows: WindowPreview[][] = [];
    for (let i = 0; i < total; i += columns) {
      rows.push(windows.slice(i, i + columns));
    }

    return (
      <div
        className="relative rounded-xl border border-white/10 overflow-hidden w-full h-full flex flex-col items-center justify-center gap-y-10 px-6 py-8"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {rows.length > 0 ? (
          rows.map((row) => (
            <div key={row.map(r => r.id).join('-')} className="flex justify-center items-center gap-x-6">
              {row.map((win) => (
                <button
                  role="button"
                  key={win.id}
                  onClick={() => handleAppClick(win.id)}
                  className="relative transition-transform hover:scale-105 hover:ring-2 hover:ring-orange-400/80 rounded-lg cursor-pointer group"
                  style={{ width: `${fakeWidth}px`, height: `${fakeHeight}px` }}
                  tabIndex={0}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAppClose(win.id);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 z-20 opacity-0 group-hover:opacity-100 transition"
                    title="Close"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <ThemedBox
                    className="absolute inset-0 rounded-lg border overflow-hidden shadow-lg flex flex-col items-center justify-center"
                    lightClassName="bg-white border-zinc-400 text-zinc-700"
                    darkClassName="bg-zinc-900 border-zinc-600 text-zinc-200"
                  >
                    <Image src={win.icon} alt={win.title} width={40} height={40} className="mb-2" />
                    <p className="text-sm whitespace-nowrap text-center">{win.title} (Preview)</p>
                  </ThemedBox>
                  <div className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-sm bg-zinc-900/90 border border-zinc-600 text-white shadow whitespace-nowrap">
                    {win.title}
                  </div>
                </button>
              ))}
            </div>
          ))
        ) : (
          <p className="text-zinc-300 text-sm mt-8">No windows open in this workspace.</p>
        )}
      </div>
    );
  };

  if (!show) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 text-white flex flex-col bg-[#3e3e3e] bg-ub transition-all duration-300',
        className
      )}
      style={{ paddingLeft: '56px', marginTop: '32px' }}
    >
      {/* Search */}
      <div className="pt-5 px-6">
        <div className="relative w-full max-w-3xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search your computer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Desktop View */}
      <div className="flex-1 flex justify-center items-start px-4 py-6 relative">
        {/* Left Peek */}
        {currentWorkspace > 0 && (
          <button
            className="absolute left-0 top-0 h-full w-[110px] -ml-2.5 z-10 cursor-pointer"
            onClick={() => setCurrentWorkspace(currentWorkspace - 1)}
          >
            {renderWorkspacePreview([], true, 'left')}
          </button>
        )}

        {/* Main Workspace */}
        <div
          className="relative z-20 w-full max-w-6xl h-full rounded-xl shadow-2xl border border-white/10 bg-cover bg-center"
          style={{
            backgroundImage: `url(${wallpaper})`,
          }}
        >
          {renderWorkspacePreview(filteredWindows)}
        </div>

        {/* Right Peek */}
        {currentWorkspace < openWindowsPerWorkspace.length - 1 && (
          <button
            className="absolute right-0 top-0 h-full w-[110px] -mr-2.5 z-10 cursor-pointer"
            onClick={() => setCurrentWorkspace(currentWorkspace + 1)}
          >
            {renderWorkspacePreview([], true, 'right')}
          </button>
        )}
      </div>
    </div>
  );
}
