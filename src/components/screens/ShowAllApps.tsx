'use client';

import Navbar from '@/components/ui/Navbar'; // You must have this already
import clsx from 'clsx';
import { Search } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import apps from '../../../apps.config';
import { motion } from 'framer-motion';

type Props = {
  show: boolean;
  onClose: () => void;
  onLaunchApp: (id: string) => void;
  previewImage: string | null;
  className?: string;
};

export default function ShowAllApps({ show, onClose, onLaunchApp, previewImage, className }: Readonly<Props>) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = useMemo(() => {
      return apps.filter((app) =>
        app.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'fixed inset-0 bg-zinc-900 text-white flex flex-col transition-opacity duration-300',
        className
      )}
    >
      {/* Navbar */}
      <Navbar lockScreen={() => {}} shutDown={() => {}} openActivities={() => onClose() }/>

        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Search Bar */}
          <div className="w-full max-w-xl relative mx-auto mt-8 mb-6 px-4">
            <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-yellow-500/80 transition-colors duration-200"
              size={20}
            />
            <input
              type="text"
              placeholder="Search apps, files, or folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-3 rounded-full bg-zinc-900 text-white text-sm md:text-base border border-zinc-700 outline-none focus:ring-2 focus:ring-yellow-500/10 focus:border-yellow-500/40 shadow-md transition-all duration-200 ease-in-out focus:bg-zinc-800 hover:bg-zinc-800 placeholder:text-zinc-400"
            />
            </div>
            </div>


          {/* Desktop Preview Image */}
          {previewImage && (
            <button
              className="mx-auto mb-8 cursor-pointer w-fit"
              onClick={onClose}
            >
              <div className="rounded-lg overflow-hidden border border-zinc-700 hover:opacity-90 transition-all brightness-75 w-[35vh] aspect-video">
                <Image
                  src={previewImage}
                  alt="Desktop Preview"
                  width={1172}
                  height={660}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </button>
          )}

          {/* App Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-10 gap-y-8 max-w-[1100px] mx-auto px-4">
            {filteredApps.map((app) => (
              <button
                type="button"
                key={app.id}
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
                onClick={() => {
                  onLaunchApp(app.id);
                  onClose();
                }}
              >
                <Image
                  src={app.icon}
                  alt={app.title}
                  width={64}
                  height={64}
                  className="mb-2"
                />
                <span className="text-xs font-medium text-center">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
  );
}
