'use client';

import ThemedBox from '@/components/ui/ThemedBox';
import useMounted from '@/hooks/useMounted';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type StatusCardProps = {
  visible: boolean;
  shutDown?: () => void;
  lockScreen?: () => void;
  toggleVisible?: () => void;
};

export default function StatusCard({ visible, shutDown, lockScreen }: StatusCardProps) {
  const [soundLevel, setSoundLevel] = useState(75);
  const [brightnessLevel, setBrightnessLevel] = useState(100);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sound = Number(localStorage.getItem('sound-level') || '75');
    const brightness = Number(localStorage.getItem('brightness-level') || '100');
    setSoundLevel(sound);
    setBrightnessLevel(brightness);
    const screen = document.getElementById('monitor-screen');
    if (screen) screen.style.filter = `brightness(${(3 / 400) * brightness + 0.25})`;
  }, []);

  const handleSound = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSoundLevel(val);
    localStorage.setItem('sound-level', val.toString());
  };

  const handleBrightness = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setBrightnessLevel(val);
    localStorage.setItem('brightness-level', val.toString());
    const screen = document.getElementById('monitor-screen');
    if (screen) screen.style.filter = `brightness(${(3 / 400) * val + 0.25})`;
  };

  const handleItemClick = (label: string) => {
    if (label === 'Dark Style') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  };

  const openApp = (appId: string) => {
    const event = new CustomEvent('launchApp', { detail: appId });
    window.dispatchEvent(event);
  };

  const topActions = [
    { icon: 'emblem-system-symbolic', label: 'Settings', onClick: () => openApp('settings') },
    { icon: 'changes-prevent-symbolic', label: 'Lock Screen', onClick: lockScreen },
    { icon: 'system-shutdown-symbolic', label: 'Power', onClick: shutDown },
  ];

  const items = [
    { icon: 'network-wireless-signal-good-symbolic', label: 'Wi-Fi', sub: 'sarthak', active: true, arrow: true },
    { icon: 'bluetooth-symbolic', label: 'Bluetooth', active: true, arrow: true },
    { icon: 'power-profile-balanced-symbolic', label: 'Power Mode', sub: 'Balanced', active: false, arrow: true },
    { icon: 'weather-clear-night-symbolic', label: 'Night Light', active: false },
    { icon: 'preferences-desktop-theme-symbolic', label: 'Dark Style' },
    { icon: 'airplane-mode-symbolic', label: 'Airplane Mode', active: false },
  ];

  const getIconSrc = (name: string, isActive = true) =>
    `/status/${resolvedTheme === 'light' && !isActive ? `${name}-dark` : name}.svg`;

  if (!mounted) return null;

  return (
    <div ref={wrapperRef}>
      <ThemedBox
        className={clsx(
          'absolute top-9 right-3 w-[360px] z-[1000] rounded-2xl p-4 backdrop-blur-md shadow-xl border transition-all duration-300',
          visible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        )}
        lightClassName="bg-[#f7f7f7] border-[#d0d0d0] text-[#1a1a1a]"
        darkClassName="bg-[#1c1c1c] border-white/20 text-white"
      >
        {/* Arrow */}
        <div
          className={clsx(
            'absolute w-0 h-0 -top-2 right-6 border-l-8 border-r-8 border-b-8 border-transparent',
            resolvedTheme === 'dark' ? 'border-b-[#1c1c1c]' : 'border-b-[#f7f7f7]'
          )}
          style={{ boxShadow: resolvedTheme === 'light' ? '0 1px 4px rgba(0, 0, 0, 0.08)' : undefined }}
        />

        {/* Top Row */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Image
              src={getIconSrc('battery-good-symbolic', resolvedTheme !== 'light')}
              alt="Battery"
              width={20}
              height={20}
              className="opacity-90"
            />
            <span className="tracking-tight">100%</span>
          </div>
          <div className="flex gap-2">
            {topActions.map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className={clsx(
                  'w-9 h-9 flex items-center justify-center rounded-full border transition-colors duration-200',
                  resolvedTheme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 border-white/10'
                    : 'bg-[#ececec] hover:bg-[#dfdfdf] border-[#d4d4d4] shadow-sm'
                )}
              >
                <Image
                  src={getIconSrc(btn.icon, resolvedTheme !== 'light')}
                  alt={btn.label}
                  width={16}
                  height={16}
                  className="opacity-90"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        {[
          {
            label: 'Headphones',
            icon: 'audio-headphones-symbolic',
            value: soundLevel,
            onChange: handleSound,
          },
          {
            label: 'Brightness',
            icon: 'display-brightness-symbolic',
            value: brightnessLevel,
            onChange: handleBrightness,
          },
        ].map((slider, i) => (
          <div className="flex items-center gap-3 mb-3" key={i}>
            <Image src={getIconSrc(slider.icon, resolvedTheme !== 'light')} alt={slider.label} width={20} height={20} />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={slider.value}
                onChange={slider.onChange}
                className={clsx(
                  'w-full h-2 appearance-none rounded-full outline-none cursor-pointer bg-transparent',
                  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
                  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600',
                  '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:mt-[-4px]'
                )}
              />
            </div>
          </div>
        ))}

        {/* Status Toggles */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {items.map((item, i) => {
            const isDarkModeToggle = item.label === 'Dark Style' && resolvedTheme === 'dark';
            const isActive = item.active || isDarkModeToggle;

            return (
              <div
                key={i}
                onClick={() => handleItemClick(item.label)}
                className={clsx(
                  'flex items-center justify-between px-3 py-3 rounded-full cursor-pointer transition-colors duration-200 shadow-sm',
                  isActive
                    ? 'bg-[#f25d27] hover:bg-[#ec4d1f] text-white'
                    : resolvedTheme === 'light'
                    ? 'bg-white hover:bg-[#f0f0f0] text-[#1c1c1c]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                )}
              >
                <div className="flex items-center gap-2">
                  <Image src={getIconSrc(item.icon, isActive)} alt={item.label} width={20} height={20} />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">{item.label}</span>
                    {item.sub && <span className="text-xs opacity-70 -mt-0.5">{item.sub}</span>}
                  </div>
                </div>
                {item.arrow && (
                  <svg
                    className="w-3 h-3 text-black/70 dark:text-gray-300 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </ThemedBox>
    </div>
  );
}
