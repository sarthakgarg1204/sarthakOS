'use client';

import type { WindowData, WindowType } from '@/components/types/windowTypes';
import UbuntuWindow from '@/components/windowing/UbuntuWindow';
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import apps, { getAppConfigById } from '../../../apps.config';

const WORKSPACE_COUNT = 4;

type Props = {
  currentWorkspace: number;
  workspaces: WindowData[][];
  setWorkspaces: React.Dispatch<React.SetStateAction<WindowData[][]>>;
  switchWorkspace: (index: number) => void;
  onMaximizedStateChange: (isAnyMaximized: boolean) => void;
  onWindowStateChange?: (state: {
    allWindows: WindowData[];
    closedWindows: Record<string, boolean>;
    isMinimized: Record<string, boolean>;
    focusedWindows: Record<string, boolean>;
  }) => void;
  onSidebarToggle?: (hide: boolean) => void;
};

export default function WindowManager({
  currentWorkspace,
  onMaximizedStateChange,
  onWindowStateChange,
  onSidebarToggle,
}: Readonly<Props>) {
  const [workspaces, setWorkspaces] = useState<WindowData[][]>(
    Array.from({ length: WORKSPACE_COUNT }, () => [])
  );


  const zIndexCounter = useRef(2);
  const prevMaximizedRef = useRef<boolean | null>(null);

  const updateCurrentWorkspace = useCallback(
    (fn: (wins: WindowData[]) => WindowData[]) => {
      setWorkspaces((prev) => {
        const updated = [...prev];
        updated[currentWorkspace] = fn(updated[currentWorkspace]);
        return updated;
      });
    },
    [currentWorkspace]
  );

  const findWorkspaceOf = useCallback(
    (id: string) => workspaces.findIndex((ws) => ws.some((w) => w.id === id)),
    [workspaces]
  );

  const allWindows = useMemo(() => workspaces.flat(), [workspaces]);

  const focusedWindows = useMemo(() => {
    const result: Record<string, boolean> = {};
    allWindows.forEach((w) => {
      result[w.type] = w.isFocused;
    });
    return result;
  }, [allWindows]);

  const isMinimized = useMemo(() => {
    const result: Record<string, boolean> = {};
    allWindows.forEach((w) => {
      result[w.type] = w.isMinimized;
    });
    return result;
  }, [allWindows]);

  const closedWindows = useMemo(() => {
    const openTypes = new Set(allWindows.map((w) => w.type));
    const allAppTypes = apps.map((a) => a.id) as WindowType[];
    const closed: Record<string, boolean> = {};
    for (const type of allAppTypes) {
      closed[type] = !openTypes.has(type);
    }
    return closed;
  }, [allWindows]);

  useEffect(() => {
    onWindowStateChange?.({
      allWindows,
      closedWindows,
      isMinimized,
      focusedWindows,
    });
  }, [allWindows, closedWindows, isMinimized, focusedWindows, onWindowStateChange]);

  const focusWindow = useCallback(
    (id: string) => {
      const wsIdx = findWorkspaceOf(id);
      if (wsIdx === -1) return;
      setWorkspaces((prev) => {
        const updated = [...prev];
        updated[wsIdx] = updated[wsIdx].map((w) => ({
          ...w,
          isFocused: w.id === id,
          zIndex: w.id === id ? zIndexCounter.current++ : w.zIndex,
        }));
        return updated;
      });
    },
    [findWorkspaceOf]
  );

  const restoreWindow = useCallback(
    (appId: string) => {
      const wsIdx = workspaces.findIndex((ws) =>
        ws.some((w) => w.type === appId)
      );
      if (wsIdx === -1) return;

      setWorkspaces((prev) => {
        const updated = [...prev];
        updated[wsIdx] = updated[wsIdx].map((w) =>
          w.type === appId ? { ...w, isMinimized: false } : w
        );
        return updated;
      });
    },
    [workspaces]
  );

  const closeWindow = useCallback(
    (id: string) => {
      const wsIdx = findWorkspaceOf(id);
      if (wsIdx === -1) return;

      setWorkspaces((prev) => {
        const updated = [...prev];
        updated[wsIdx] = updated[wsIdx].filter((w) => w.id !== id);

        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('closeWindow', { detail: id })
          );
        }, 0);

        return updated;
      });
    },
    [findWorkspaceOf]
  );

  const toggleMaximize = (id: string) => {
    updateCurrentWorkspace((wins) =>
      wins.map((w) => {
        if (w.id !== id) return w;
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            prevPosition: w.prevPosition ?? w.position,
            prevSize: w.prevSize ?? w.size,
            position: { x: 0, y: 0 },
            size: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
          };
        }
        return {
          ...w,
          isMaximized: false,
          position: w.prevPosition ?? { x: 120, y: 80 },
          size: w.prevSize ?? { width: 900, height: 600 },
          prevPosition: undefined,
          prevSize: undefined,
        };
      })
    );
  };

  const toggleMinimize = (id: string) => {
    updateCurrentWorkspace((wins) =>
      wins.map((w) =>
        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
      )
    );
  };

  const moveWindow = (id: string, pos: { x: number; y: number }) => {
    updateCurrentWorkspace((wins) =>
      wins.map((w) => (w.id === id ? { ...w, position: pos } : w))
    );
  };

  const resizeWindow = (id: string, size: { width: number; height: number }) => {
    updateCurrentWorkspace((wins) =>
      wins.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  const openWindow = useCallback(
    (type: WindowType) => {
      const alreadyOpen = workspaces.some((ws) =>
        ws.some((w) => w.type === type)
      );
      if (alreadyOpen) return;

      const config = getAppConfigById(type);
      if (!config) return;

      const id = `${type}-${Date.now()}`;
      let screen: () => JSX.Element;

      if (config.screen) {
        screen = config.screen;
      } else if (config.component) {
        const Component = config.component;
        screen = () => <Component id={id} />;
      } else {
        screen = () => <div className="p-4">Coming Soon</div>;
      }

      const newWindow: WindowData = {
        id,
        type,
        title: config.title,
        icon: config.icon,
        isFocused: true,
        isMinimized: false,
        isMaximized: false,

        position: { x: 120, y: 80 },
        size: { width: 900, height: 600 },
        zIndex: zIndexCounter.current++,
        screen,
      };

      setWorkspaces((prev) => {
        const updated = [...prev];
        updated[currentWorkspace] = updated[currentWorkspace]
          .map((w) => ({ ...w, isFocused: false }))
          .concat(newWindow);
        return updated;
      });
    },
    [workspaces, currentWorkspace]
  );

  useEffect(() => {
    const anyMaximized = allWindows.some(
      (w) => w.isMaximized && !w.isMinimized
    );
    if (prevMaximizedRef.current !== anyMaximized) {
      onMaximizedStateChange(anyMaximized);
      prevMaximizedRef.current = anyMaximized;
      onSidebarToggle?.(anyMaximized);
    }
  }, [allWindows, onMaximizedStateChange, onSidebarToggle]);

  useEffect(() => {
    const handlers: [string, (e: CustomEvent<WindowType>) => void][] = [
      ['launchApp', (e) => openWindow(e.detail as WindowType)],
      ['restoreMinimized', (e) => restoreWindow(e.detail as string)],
      ['focusWindow', (e) => focusWindow(e.detail as string)],
      ['closeWindow', (e) => closeWindow(e.detail as string)],
    ];

    handlers.forEach(([event, handler]) =>
      window.addEventListener(event, handler as EventListener)
    );

    return () =>
      handlers.forEach(([event, handler]) =>
        window.removeEventListener(event, handler as EventListener)
      );
  }, [openWindow, restoreWindow, focusWindow, closeWindow]);

  const currentWindows = workspaces[currentWorkspace] || [];

  return (
    <>
      {currentWindows.map((win) => (
        <div
          key={win.id}
          style={{ display: win.isMinimized ? 'none' : 'block' }}
          className={win.isMaximized ? 'ubuntu-maximized-window' : ''}
        >
          <UbuntuWindow
            {...win}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => toggleMinimize(win.id)}
            onMaximize={() => toggleMaximize(win.id)}
            onMove={(pos) => moveWindow(win.id, pos)}
            onResize={(size) => resizeWindow(win.id, size)}
          >
            {win.screen()}
          </UbuntuWindow>
        </div>
      ))}
    </>
  );
}
