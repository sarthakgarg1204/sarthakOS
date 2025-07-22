"use client";

import ThemedBox from "@/components/ui/ThemedBox";
import { RotateCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type TrashItem = {
  name: string;
  icon: string;
};

const initialTrashItems: TrashItem[] = [
  { name: "php", icon: "/filetypes/php.png" },
  { name: "Angular.js", icon: "/filetypes/js.png" },
  { name: "node_modules", icon: "/system/folder.png" },
  { name: "abandoned project", icon: "/system/folder.png" },
  { name: "18BCP127 assignment name.zip", icon: "/filetypes/zip.png" },
  { name: "project final", icon: "/system/folder.png" },
  { name: "project ultra-final", icon: "/system/folder.png" },
];

export default function TrashApp() {
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("trash-empty");
    if (stored === "true") setIsEmpty(true);
  }, []);

  const emptyTrash = () => {
    setIsEmpty(true);
    localStorage.setItem("trash-empty", "true");
  };

  const EmptyView = () => (
    <div className="flex-grow flex flex-col justify-center items-center text-gray-400">
      <Image
        src="/status/user-trash-symbolic.svg"
        alt="Trash Empty"
        width={96}
        height={96}
        className="opacity-50"
      />
      <span className="font-bold mt-3 text-base">Trash is Empty</span>
    </div>
  );

  const FilledView = () => (
    <div className="p-4 pb-20 grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-x-6 gap-y-6 overflow-auto relative">
      {initialTrashItems.map((item, index) => (
        <div
          key={index}
          tabIndex={0}
          className="group relative max-w-[96px] w-full mx-auto flex flex-col items-center justify-start rounded-md p-2 transition-all duration-100 hover:bg-[#E95420]/20 hover:ring-1 hover:ring-[#E95420] hover:shadow-sm focus:bg-[#E95420]/20 focus:ring-1 focus:ring-[#E95420] focus:shadow-sm"
          style={{ overflow: "visible" }}
        >
          <Image
            src={item.icon}
            alt={item.name}
            width={40}
            height={40}
            className="object-contain"
          />

          {/* Default (truncated) label */}
          <div className="w-full mt-2 px-1 text-xs text-center">
            <span className="block rounded-sm py-0.5 px-1 truncate">
              {item.name}
            </span>
          </div>

          {/* Tooltip on hover/focus */}
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-30 px-2 py-1 text-[11px] font-normal rounded-md max-w-[220px] text-center bg-white/95 text-black dark:bg-[#1e1e1e]/95 dark:text-white shadow-xl border border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-normal break-words">
            {item.name}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <ThemedBox
      className="w-full h-full flex flex-col select-none"
      darkClassName="bg-[#2e2e2e] text-white"
      lightClassName="bg-[#f6f6f6] text-black"
    >
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-black/10 dark:border-white/10 dark:bg-[#1e1e1e] bg-[#f2f2f2]">
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1.5 rounded-sm text-[13px] font-semibold text-black dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-400 dark:border-gray-600">
            <RotateCcw className="w-4 h-4" />
            <span>Restore</span>
          </button>
          <button
            onClick={emptyTrash}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-sm text-[13px] font-semibold text-white bg-[#E95420] hover:bg-[#cc4520] border border-[#b13a1b]"
          >
            <Trash2 className="w-4 h-4" />
            <span>Empty</span>
          </button>
        </div>
      </div>

      {/* Main View */}
      {isEmpty ? <EmptyView /> : <FilledView />}
    </ThemedBox>
  );
}
