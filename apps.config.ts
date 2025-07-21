import type { WindowType } from '@/components/types/windowTypes';
import dynamic from 'next/dynamic';

export type AppConfig = {
  id: WindowType;
  title: string;
  icon: string;
  disabled?: boolean;
  favourite?: boolean;
  desktop_shortcut?: boolean;
  isExternalApp?: boolean;
  screen?: () => React.ReactElement;
  url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
};

const apps: AppConfig[] = [
  {
    id: 'aboutSarthak',
    title: 'About Sarthak',
    icon: '/system/user-home.png',
    favourite: true,
    desktop_shortcut: true,
  },
  {
    id: 'chrome',
    title: 'Google Chrome',
    icon: '/icons/chrome.svg',
    favourite: true,
    desktop_shortcut: true,
    component: dynamic(() => import('@/components/apps/ChromeApp')),
  },
  {
    id: 'calc',
    title: 'Calc',
    icon: '/icons/calc.svg',
    favourite: true,
    desktop_shortcut: false,
    component: dynamic(() => import('@/components/apps/CalculatorApp')),
  },
  {
    id: 'terminal',
    title: 'Terminal',
    icon: '/icons/bash.svg',
    favourite: true,
    desktop_shortcut: false,
    component: dynamic(() => import('@/components/apps/TerminalApp')),
  },
  {
    id: 'spotify',
    title: 'Spotify',
    icon: '/icons/spotify.svg',
    favourite: true,
    desktop_shortcut: false,
    component: dynamic(() => import('@/components/apps/SpotifyApp')),
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: '/icons/gnome-control-center.svg',
    favourite: true,
    desktop_shortcut: false,
    component: dynamic(() => import('@/components/apps/SettingsAppWrapper')),
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: '/icons/calendar.svg',
    favourite: false,
    desktop_shortcut: true,
    component: dynamic(() => import('@/components/apps/CalendarApp').then(mod => mod.default)),
  },
  {
    id: 'gedit',
    title: 'Contact Me',
    icon: '/icons/gedit.svg',
    favourite: false,
    desktop_shortcut: true,
    component: dynamic(() => import('@/components/apps/ContactApp')),
  },
  {
    id: 'todo',
    title: 'Todo List',
    icon: '/icons/todo.svg',
    favourite: false,
    desktop_shortcut: true,
    component: dynamic(() => import('@/components/apps/TodoApp')),
  },
  {
    id: 'trash',
    title: 'Trash',
    icon: '/system/user-trash-full.png',
    favourite: false,
    desktop_shortcut: true,
    component: dynamic(() => import('@/components/apps/TrashApp')),
  },
  {
    id: 'github',
    title: 'GitHub',
    icon: '/icons/github.svg',
    favourite: false,
    desktop_shortcut: true,
    isExternalApp: true,
    url: 'https://github.com/sarthakgarg1204',
  },
];

export default apps;

export const getAppConfigById = (id: WindowType): AppConfig | undefined =>
  apps.find(app => app.id === id);
