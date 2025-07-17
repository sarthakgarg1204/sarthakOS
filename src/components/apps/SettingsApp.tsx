"use client";

import Image from "next/image";
import React from "react";
import wallpapers from "../../../wallpaper.config";

type Props = {
  currBgImgName: string;
  changeBackgroundImage: (name: string) => void;
};

export default function SettingsApp({ currBgImgName, changeBackgroundImage }: Props) {
  const handleChange = (name: string) => {
    changeBackgroundImage(name);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-zinc-800 text-white select-none p-4 space-y-6">
      {/* ✅ Image Preloading using <Image /> */}
      <div className="hidden">
        {Object.entries(wallpapers).map(([name, path], idx) => (
          <Image
            key={name}
            src={path}
            alt={name}
            width={1}
            height={1}
            loading="eager"
            priority={idx < 5} // preload top 5 for fastest switching
          />
        ))}
      </div>

      {/* 🔍 Preview Current Wallpaper */}
      <div
        className="w-3/4 md:w-2/5 aspect-video mx-auto rounded-lg border-2 border-white/20 shadow-lg"
        style={{
          backgroundImage: `url(${wallpapers[currBgImgName]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 🎨 Wallpaper Thumbnails */}
      <div className="flex flex-wrap justify-center gap-4 border-t border-white/20 pt-6">
        {Object.entries(wallpapers).map(([name, path]) => (
          <button
            key={name}
            onClick={() => handleChange(name)}
            onFocus={() => handleChange(name)}
            className={`outline-none w-32 h-20 rounded-md border-4 transition-all ${
              name === currBgImgName
                ? "border-yellow-500 shadow-md scale-105"
                : "border-transparent opacity-70 hover:opacity-100 hover:border-white/30"
            }`}
            style={{
              backgroundImage: `url(${path})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </div>
    </div>
  );
}
