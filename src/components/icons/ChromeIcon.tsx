// src/components/icons/ChromeIcon.tsx
import Image from 'next/image';

export const ChromeIcon = ({ className = '', size = 20 }: { className?: string; size?: number }) => {
  return (
    <Image
      src="/icons/chrome.svg"
      alt="Chrome Icon"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
};
