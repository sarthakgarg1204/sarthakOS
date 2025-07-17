'use client';

import Image from 'next/image';

export default function Status() {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      {/* Network */}
      <Image
        src="/status/network-wireless-signal-good-symbolic.svg"
        alt="WiFi"
        width={16}
        height={16}
        className="w-4 h-4 filter brightness-0 invert"
        priority
      />

      {/* Volume */}
      <Image
        src="/status/audio-volume-medium-symbolic.svg"
        alt="Sound"
        width={16}
        height={16}
        className="w-4 h-4 filter brightness-0 invert"
        priority
      />

      {/* Battery */}
      <Image
        src="/status/battery-good-symbolic.svg"
        alt="Battery"
        width={16}
        height={16}
        className="w-4 h-4 filter brightness-0 invert"
        priority
      />
    </div>
  );
}
