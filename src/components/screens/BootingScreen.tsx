'use client';

import Image from 'next/image';

type BootingScreenProps = {
  visible: boolean;
  isShutDown: boolean;
  turnOn: () => void;
};

export default function BootingScreen({ visible, isShutDown, turnOn }: Readonly<BootingScreenProps>) {
  const show = visible || isShutDown;

  return (
    <div
      style={{ zIndex: show ? 1000 : -20 }}
      className={`absolute top-0 right-0 w-screen h-screen flex flex-col justify-between items-center select-none overflow-hidden m-0 bg-ub-warm-grey p-0 transition-opacity duration-500 ${
        show ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
    >
      {/* Ubuntu Spinner / Power Logo */}
      <Image
        width={300}
        height={300}
        src="/status/cof_orange_hex.svg"
        alt="Ubuntu Logo"
        className="md:w-1/4 w-1/2 opacity-90"
        priority
      />

      {/* Power / Spinner Button */}
      <button
      type="button"
        className="w-10 h-10 flex justify-center items-center rounded-full outline-none cursor-pointer mb-6"
        onClick={turnOn}
      >
        {isShutDown ? (
          <div className="bg-white rounded-full flex justify-center items-center w-10 h-10 hover:bg-gray-300 transition">
            <Image
              width={32}
              height={32}
              src="/status/power-button.svg"
              alt="Power Button"
              className="w-8"
            />
          </div>
        ) : (
          <Image
            width={40}
            height={40}
            src="/status/process-working-symbolic.svg"
            alt="Loading Spinner"
            className={`w-10 ${visible ? 'animate-spin' : ''}`}
          />
        )}
      </button>

      {/* Ubuntu Name(Text) */}
      <Image
        width={200}
        height={100}
        src="/status/ubuntu_white_hex.svg"
        alt="Ubuntu Name"
        className="md:w-1/5 w-1/2 opacity-90"
      />

      {/* Footer Links */}
      <div className="text-zinc-300 mb-4 text-xs md:text-sm tracking-wide">
        <a
          className="underline hover:text-orange-400 transition"
          href="https://www.linkedin.com/in/sarthakgarg1204/"
          target="_blank"
          rel="noreferrer noopener"
        >
          linkedin
        </a>
        <span className="font-bold mx-2">|</span>
        <a
          className="underline hover:text-orange-400 transition"
          href="https://github.com/sarthakgarg1204/sarthakgarg1204.github.io"
          target="_blank"
          rel="noreferrer noopener"
        >
          github
        </a>
      </div>
    </div>
  );
}
