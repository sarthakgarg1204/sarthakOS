'use client';

import Clock from '@/components/util-components/Clock';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import wallpapers from '../../../wallpaper.config';

interface LockScreenProps {
  isLocked: boolean;
  unLockScreen: () => void;
  bgImgName: string;
}

export default function LockScreen({ isLocked, unLockScreen, bgImgName }: LockScreenProps) {
  useEffect(() => {
    if (!isLocked) return;

    const handleUnlock = () => {
      unLockScreen();
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('keypress', handleUnlock);
    };

    setTimeout(() => {
      window.addEventListener('click', handleUnlock);
      window.addEventListener('keypress', handleUnlock);
    }, 100); // Prevents triggering on initial lock

    return () => {
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('keypress', handleUnlock);
    };
  }, [isLocked, unLockScreen]);

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          className="fixed inset-0 z-[9999] text-white select-none"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div
            className="absolute inset-0 blur-md"
            style={{
              backgroundImage: `url(${wallpapers[bgImgName]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
            <motion.div
              className="text-6xl font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Clock onlyTime />
            </motion.div>
            <motion.div
              className="mt-4 text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Clock onlyDay />
            </motion.div>
            <motion.div
              className="mt-16 text-white/80 animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Click or press any key to unlock
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
