"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

interface UbuntuWindowProps {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (pos: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

const UbuntuWindow: React.FC<UbuntuWindowProps> = ({
  title,
  position,
  size,
  zIndex,
  isFocused,
  isMinimized,
  isMaximized,
  onClose,
  onFocus,
  onMove,
  onResize,
  onMinimize,
  onMaximize,
  children,
}) => {
  const navbarHeight = 34;

  const [windowSize, setWindowSize] = useState(size);
  const [windowPos, setWindowPos] = useState(position);

  const previousPos = useRef(position);
  const previousSize = useRef(size);

  // Sync props → internal state on prop change
  useEffect(() => {
    if (!isMaximized && !isMinimized) {
      setWindowSize(size);
      setWindowPos(position);
    }
  }, [size, position, isMaximized, isMinimized]);

  // Handle maximize / restore
  useEffect(() => {
    if (isMaximized) {
      previousPos.current = windowPos;
      previousSize.current = windowSize;
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - navbarHeight,
      });

      setWindowPos({ x: 0, y: navbarHeight });
    } else {
      setWindowSize(previousSize.current);
      setWindowPos(previousPos.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaximized]);

  const minimizedStyle: React.CSSProperties  = isMinimized
    ? { opacity: 0, pointerEvents: "none", visibility: "hidden" }
    : {};

  return (
    <Rnd
      position={windowPos}
      size={windowSize}
      enableResizing={!isMaximized}
      disableDragging={isMaximized}
      minWidth={400}
      minHeight={300}
      bounds="window"
      style={{ zIndex, position: "absolute", ...minimizedStyle }}
      onDragStop={(_, data) => {
        const newPos = { x: data.x, y: data.y };
        setWindowPos(newPos);
        onMove(newPos);
      }}
      onResizeStop={(_, __, ref, ___, pos) => {
        const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
        const newPos = pos;
        setWindowSize(newSize);
        setWindowPos(newPos);
        onResize(newSize);
        onMove(newPos);
      }}
      onMouseDown={onFocus}
      dragHandleClassName="window-drag-handle"
    >
      <motion.div
        className={clsx(
          "flex flex-col w-full h-full bg-[#2e2e2e] border border-gray-600 text-white overflow-hidden",
          isFocused ? "opacity-100" : "opacity-80",
          !isMaximized && "rounded-lg"
        )}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: isMinimized ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        {/* Title Bar */}
        <div className="window-drag-handle flex items-center justify-between px-3 py-2 rounded-md bg-ub-grey text-white select-none cursor-move">
            <div className="w-[60px]" />
          <div className="truncate text-sm font-medium pointer-events-none">
            {title}
          </div>
          <div className="flex gap-2">
            <div
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:brightness-125 cursor-pointer"
            />
            <div
              onClick={onMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:brightness-125 cursor-pointer"
            />
            <div
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:brightness-125 cursor-pointer"
            />
          </div>
        </div>

        {/* App Content */}
        <div className="flex-grow overflow-hidden bg-black/10">
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
};

export default UbuntuWindow;
