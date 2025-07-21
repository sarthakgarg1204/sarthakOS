import { JSX } from 'react';

type CustomWindowType = string & { _brand?: never };

// Define all allowed window (app) types, matching `apps.config.ts`
export type WindowType =
  | 'terminal'
  | 'calculator'
  | 'text-editor'
  | 'files'
  | 'settings'
  | 'browser'
  | 'about'
  | 'portfolio'
  | 'trash'
  | 'gallery'
  | 'contact'
  | 'music-player'
  | 'video-player'
  | CustomWindowType;

// Core window data shape
export type WindowData = {
  id: string; // unique instance ID (e.g., terminal-1712345)
  type: WindowType; // used to identify app logic
  title: string;
  icon: string;

  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number;
    height: number;
  };

  zIndex: number;

  // Function to render window screen content
  screen: () => JSX.Element;


  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
};
