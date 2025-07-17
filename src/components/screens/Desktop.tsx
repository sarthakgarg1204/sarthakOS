'use client';

import DefaultMenu from '@/components/context-menu/DefaultMenu';
import DesktopMenu from '@/components/context-menu/DesktopMenu';
import Activities from '@/components/screens/ActivitiesScreen';
import ShowAllApps from '@/components/screens/ShowAllApps';
import type { WindowData } from '@/components/types/windowTypes';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import WindowManager from '@/components/windowing/WindowManager';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import apps from '../../../apps.config';
import wallpapers from '../../../wallpaper.config';

type DesktopScreenProps = {
  bgImageName: string;
  changeBackgroundImage: (imgName: string) => void;
  lockScreen: () => void;
  shutDown: () => void;
};

 export default function DesktopScreen({
  bgImageName,
  changeBackgroundImage,
  lockScreen,
  shutDown,
}: DesktopScreenProps) {
  const [appsList, setAppsList] = useState([...apps]);
  const [showNameBar, setShowNameBar] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [iconMenuActive, setIconMenuActive] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [iconMenuPosition, setIconMenuPosition] = useState({ x: 0, y: 0 });
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState<Record<string, boolean>>({});
  const [closedWindows, setClosedWindows] = useState<Record<string, boolean>>({});
  const [focusedWindows, setFocusedWindows] = useState<Record<string, boolean>>({});
  const [folderCreationError, setFolderCreationError] = useState<string | null>(null);
  const [currentBg, setCurrentBg] = useState(bgImageName);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [showAllAppsVisible, setShowAllAppsVisible] = useState(false);
  const [showActivitiesVisible, setShowActivitiesVisible] = useState(false);
  const [topOverlay, setTopOverlay] = useState<'apps' | 'activities' | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState(0);
  const [workspaces, setWorkspaces] = useState<WindowData[][]>(
    () => Array.from({ length: 4 }, () => [])
  );

  const openOrFocusApp = (appId: string) => {
    const app = appsList.find(a => a.id === appId);

    if (app?.isExternalApp && app.url) {
      window.open(app.url, '_blank');
      return; // ❌ Do not launch a window
    };

    const flattened = workspaces.flatMap((ws, i) =>
      ws.map((w) => ({ ...w, workspaceIndex: i }))
    );

    const existingWindow = flattened.find((w) => w.id.startsWith(appId + '-'));

    if (!existingWindow) {
      window.dispatchEvent(new CustomEvent('launchApp', { detail: appId }));
      return;
    }

    if (existingWindow.workspaceIndex !== -1 &&  existingWindow.workspaceIndex !== currentWorkspace) {
      setCurrentWorkspace(existingWindow.workspaceIndex);
    }

    if (isMinimized[appId]) {
      window.dispatchEvent(new CustomEvent('restoreMinimized', { detail: appId }));
    }

    window.dispatchEvent(new CustomEvent('focusWindow', { detail: existingWindow.id }));
  };

  const handleSidebarToggle = useCallback((shouldHide: boolean) => {
    setShowSidebar((prev) => (prev === !shouldHide ? prev : !shouldHide));
  }, []);

  const toggleActivities = () => {
    setShowActivitiesVisible((prev) => {
      const newState = !prev;
      if (newState) setTopOverlay('activities');
      return newState;
    });
  };

  const handleCreateFolder = useCallback((name?: string, rowId?: number) => {
    let folderName = name;
    if (!folderName) {
      const input = document.getElementById('folder-name-input') as HTMLInputElement;
      folderName = input?.value.trim();
    }
    if (!folderName) return;

    const normalizedId = `new-folder-${folderName.replace(/\s+/g, '-').toLowerCase()}`;
    const existingFolders: { id: string; name: string }[] = JSON.parse(
      localStorage.getItem('new_folders') || '[]'
    );
    const alreadyExistsInApps = appsList.some((app) => app.id === normalizedId);
    const alreadyExistsInStorage = existingFolders.some((folder) => folder.id === normalizedId);

    if (alreadyExistsInApps || alreadyExistsInStorage) {
      setFolderCreationError(`A folder named '${folderName}' already exists.`);
      window.dispatchEvent(
        new CustomEvent('terminal-output', {
          detail: {
            type: 'error',
            message: `mkdir: cannot create directory ‘${folderName}’: Folder exists`,
            rowId,
          },
        })
      );
      return;
    }

    const newFolder = {
      id: normalizedId,
      title: folderName,
      icon: '/system/folder.png',
      disabled: true,
      favourite: false,
      desktop_shortcut: true,
      isExternalApp: false,
      url: '',
      screen: () => <div className="p-4 text-white">📁 {folderName}</div>,
    };

    setAppsList((prev) => [...prev, newFolder]);
    const updatedFolders = [...existingFolders, { id: normalizedId, name: folderName }];
    localStorage.setItem('new_folders', JSON.stringify(updatedFolders));
    window.dispatchEvent(
      new CustomEvent('terminal-output', {
        detail: {
          type: 'success',
          message: 'Folder Created Successfully',
          rowId,
        },
      })
    );

    setFolderCreationError(null);
    setShowNameBar(false);
  }, [appsList]);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ folderName: string; rowId: number }>;
      const { folderName, rowId } = customEvent.detail;
      if (!folderName) return;

      handleCreateFolder(folderName, rowId);
      window.dispatchEvent(new Event('folderCreated'));
    };

    window.addEventListener('create-folder-from-terminal', handler);
    return () => window.removeEventListener('create-folder-from-terminal', handler);
  }, [handleCreateFolder]);

  useEffect(() => {
    const folders = localStorage.getItem('new_folders');
    if (folders) {
      const parsed = JSON.parse(folders);
      parsed.forEach((folder: { id: string; name: string }) => {
        const { id, name } = folder;
        setAppsList((prev) => {
          if (prev.some((app) => app.id === id)) return prev;
          return [
            ...prev,
            {
              id,
              title: name,
              icon: '/system/folder.png',
              disabled: true,
              favourite: false,
              desktop_shortcut: true,
              isExternalApp: false,
              url: '',
              screen: () => <div className="p-4 text-white">📁 {name}</div>,
            },
          ];
        });
      });
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem('backgroundImage');
      if (stored) {
        setCurrentBg(stored);
        changeBackgroundImage(stored);
      }
    };
    window.addEventListener('changeBackground', handler);
    return () => window.removeEventListener('changeBackground', handler);
  }, [changeBackgroundImage]);

  const handleShowAllApps = () => {
    const preview = wallpapers[currentBg] || wallpapers['wall-14'];
    setDesktopPreview(preview);
    setShowAllAppsVisible((prev) => {
      const newState = !prev;
      if (newState) setTopOverlay('apps');
      return newState;
    });
  };

  const appsOpenInOtherWorkspaces = useMemo(() => {
    const result = new Set<string>();
    workspaces.forEach((ws, i) => {
      if (i === currentWorkspace) return;
      ws.forEach((w) => {
        const appKey = w.id.split('-')[0];
        result.add(appKey);
      });
    });
    return Object.fromEntries([...result].map((id) => [id, true]));
  }, [workspaces, currentWorkspace]);


  useEffect(() => {
    const handleLaunch = (e: CustomEvent<string>) => {
      const appId = e.detail;
      const existing = workspaces[currentWorkspace].find((w) =>
        w.id.startsWith(appId + '-')
      );
      if (existing) {
        setFocusedWindows((prev) => ({ ...prev, [existing.id]: true }));
        return;
      }
      const app = appsList.find((a) => a.id === appId);
      if (!app) return;

      const newWindow: WindowData = {
        id: `${app.id}-${Date.now()}`,
        title: app.title,
        icon: app.icon,
        type: 'chrome',
        isFocused: false,
        isMinimized: false,
        isMaximized: false,
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        zIndex: 0,
      };

      setWorkspaces((prev) =>
        prev.map((ws, i) =>
          i === currentWorkspace ? [...ws, newWindow] : ws
        )
      );
    };

    window.addEventListener('launchApp', handleLaunch as EventListener);
    return () => window.removeEventListener('launchApp', handleLaunch as EventListener);
  }, [appsList, currentWorkspace, workspaces]);

  useEffect(() => {
    const handleClose = (e: CustomEvent<string>) => {

      const id = e.detail;

        setWorkspaces(prev =>
          prev.map((ws) =>
            ws.some(w => w.id === id)
              ? ws.filter(w => w.id !== id)
              : ws
          )
        );
    };

    window.addEventListener('closeWindow', handleClose as EventListener);
    return () => window.removeEventListener('closeWindow', handleClose as EventListener);
  }, [currentWorkspace]);

  const resolvedBackground = wallpapers[currentBg] || wallpapers['wall-14'];
  const iconHeight = 80;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
  const maxIconsPerColumn = Math.floor(screenHeight / iconHeight);
  const desktopShortcuts = appsList.filter((app) => app.desktop_shortcut);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 208;
    const menuHeight = 400;
    const padding = 8;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > windowWidth - padding) x = windowWidth - menuWidth - padding;
    if (y + menuHeight > windowHeight - padding) y = windowHeight - menuHeight - padding;

    setIconMenuActive(false);
    setContextMenuPos({ x, y });
    setMenuActive(true);
  };

  const handleClick = () => {
    setMenuActive(false);
    setIconMenuActive(false);
  };

  const handleWindowStateChange = (state: {
    allWindows: WindowData[];
    closedWindows: Record<string, boolean>;
    isMinimized: Record<string, boolean>;
    focusedWindows: Record<string, boolean>;
  }) => {
    setClosedWindows(state.closedWindows);
    setIsMinimized(state.isMinimized);
    setFocusedWindows(state.focusedWindows);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-cover bg-center transition-all duration-300"
      style={{ backgroundImage: `url(${resolvedBackground})` }}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
    >
      <Navbar lockScreen={lockScreen} shutDown={shutDown} openActivities={toggleActivities} />
      {desktopShortcuts.map((app, index) => {
        const column = Math.floor(index / maxIconsPerColumn);
        const row = index % maxIconsPerColumn;
        const rightOffset = 10 + column * 80;

        return (
          <div
            key={app.id}
            title={app.title}
            className="absolute text-white text-center cursor-pointer hover:bg-white/10 rounded-lg p-2 w-20 flex flex-col items-center"
            style={{ top: `${row * iconHeight + 40}px`, right: `${rightOffset}px` }}
            onClick={() => openOrFocusApp(app.id)}
            onDoubleClick={() => openOrFocusApp(app.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const menuWidth = 208;
              const menuHeight = 320;
              const padding = 8;
              const windowWidth = window.innerWidth;
              const windowHeight = window.innerHeight;

              let x = e.clientX;
              let y = e.clientY;

              if (x + menuWidth > windowWidth - padding) x = windowWidth - menuWidth - padding;
              if (y + menuHeight > windowHeight - padding) y = windowHeight - menuHeight - padding;

              setIconMenuActive(true);
              setMenuActive(false);
              setIconMenuPosition({ x, y });
            }}
          >
            <Image
              src={app.icon}
              alt={app.title || "App icon"}
              width={40}
              height={40}
              className="w-9 h-9"
            />
            <p className="text-xs mt-1 truncate w-full">{app.title}</p>
          </div>
        );
      })}

      <WindowManager
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
        setWorkspaces={setWorkspaces}
        switchWorkspace={setCurrentWorkspace}
        onMaximizedStateChange={setIsMaximized}
        onSidebarToggle={handleSidebarToggle}
        onWindowStateChange={handleWindowStateChange}
      />

      <DesktopMenu
        active={menuActive}
        position={contextMenuPos}
        openApp={openOrFocusApp}
        addNewFolder={() => setShowNameBar(true)}
      />

      <DefaultMenu
        active={iconMenuActive}
        position={iconMenuPosition}
      />

      {showNameBar && (
        <div className="absolute rounded-md top-1/2 left-1/2 text-center text-white font-mono text-sm bg-[#2e3436] transform -translate-y-1/2 -translate-x-1/2 sm:w-96 w-3/4 z-50">
          <div className="w-full flex flex-col justify-around items-start pl-6 pb-8 pt-6">
            <span>New folder name</span>
            <input
              className="outline-none mt-5 px-1 w-10/12 context-menu-bg border-2 border-yellow-700 rounded py-0.5"
              id="folder-name-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
            {folderCreationError && (
              <p className="text-red-500 mt-3 text-xs">{folderCreationError}</p>
            )}
          </div>
          <div className="flex">
            <div
              onClick={() => handleCreateFolder()}
              className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 border-r-0 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50"
            >
              Create
            </div>
            <div
              onClick={() => setShowNameBar(false)}
              className="w-1/2 px-4 py-2 border border-gray-900 border-opacity-50 hover:bg-ub-warm-grey hover:bg-opacity-10 hover:border-opacity-50"
            >
              Cancel
            </div>
          </div>
        </div>
      )}

      {showSidebar && (
        <Sidebar
          apps={appsList}
          closedWindows={closedWindows}
          focusedWindows={focusedWindows}
          isMinimized={isMinimized}
          isMaximized={isMaximized}
          toggleAllApps={handleShowAllApps}
          isAllAppsOpen={showAllAppsVisible}
          openOrFocusApp={openOrFocusApp}
          currentWorkspace={currentWorkspace}
          appsOpenInOtherWorkspaces={appsOpenInOtherWorkspaces}
        />
      )}

      <ShowAllApps
        show={showAllAppsVisible}
        onClose={() => {
          setShowAllAppsVisible(false);
          if (topOverlay === 'apps') setTopOverlay(null);
        }}
        onLaunchApp={openOrFocusApp}
        previewImage={desktopPreview}
        className={topOverlay === 'apps' ? 'z-[100]' : 'z-[99]'}
      />

      <Activities
        show={showActivitiesVisible}
        onClose={() => {
          setShowActivitiesVisible(false);
          if (topOverlay === 'activities') setTopOverlay(null);
        }}
        openWindowsPerWorkspace={workspaces.map(ws =>
          ws.map(w => ({ id: w.id, title: w.title, icon: w.icon }))
        )}
        currentWorkspace={currentWorkspace}
        setCurrentWorkspace={setCurrentWorkspace}
        wallpaper={resolvedBackground}
        className={topOverlay === 'activities' ? 'z-[100]' : 'z-[99]'}
      />
    </div>
  );
};
