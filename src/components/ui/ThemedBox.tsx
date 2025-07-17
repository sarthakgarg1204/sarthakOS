// components/ui/ThemedBox.tsx
'use client';

import useMounted from "@/hooks/useMounted";
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { CSSProperties, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  lightClassName?: string;
  darkClassName?: string;
  style?: CSSProperties;
};

export default function ThemedBox({
  children,
  className,
  lightClassName = 'bg-white text-black',
  darkClassName = 'bg-black text-white',
  style,
}: Props) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div
      style={style}
      className={clsx(
        className,
        resolvedTheme === 'dark' ? darkClassName : lightClassName
      )}
    >
      {children}
    </div>
  );
}
