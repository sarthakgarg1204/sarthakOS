"use client";

import SideBarApp from "@/components/windowing/SideBarApp";
import Image from "next/image";
import { useState } from "react";
import appsConfig from "../../../apps.config"; // 👈 Use original config to get `favourite` flags

type App = {
  id: string;
  title: string;
  icon: string;
};

type Props = {
  apps: App[];
  closedWindows: Record<string, boolean>;
  focusedWindows: Record<string, boolean>;
  isMinimized: Record<string, boolean>;
  openOrFocusApp: (id: string) => void;
  toggleAllApps: () => void;
  isMaximized: boolean;
  isAllAppsOpen: boolean;
  currentWorkspace: number;
  appsOpenInOtherWorkspaces: Record<string, boolean>;
};

export default function SideBar({
  apps,
  closedWindows,
  focusedWindows,
  isMinimized,
  openOrFocusApp,
  toggleAllApps,
  isMaximized,
  isAllAppsOpen,
  appsOpenInOtherWorkspaces,
}: Readonly<Props>) {
  if (!apps) return null;

  // 🔍 Get all favourite app IDs from the config
  const favouriteAppIds = appsConfig
    .filter((app) => app.favourite)
    .map((app) => app.id);

  // 🧠 Build a unique list of apps to show:
  // 1. All favourite apps
  // 2. All currently open apps (not closed), even if not favourite
  const appMap: Record<string, App> = {};
  apps.forEach((app) => {
    const isOpen = !closedWindows[app.id];
    const isFavourite = favouriteAppIds.includes(app.id);

    if (isOpen || isFavourite) {
      appMap[app.id] = app; // Ensures uniqueness by `id`
    }
  });

  const visibleApps = Object.values(appMap);

  return (
    <div
      className={`fixed top-5 left-0 h-full w-16 z-101 flex flex-col items-center justify-between bg-[rgba(0,0,0,0.6)] backdrop-blur-md pt-4 px-1 transition-all duration-500 ease-in-out ${
        isMaximized ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      {/* App Icons */}
      <div className="flex flex-col items-center gap-2">
        {visibleApps.map((app) => {
          const isOpenInAnotherWorkspace = !!appsOpenInOtherWorkspaces[app.id];
          return (
            <SideBarApp
              key={app.id}
              {...app}
              isClose={closedWindows[app.id]}
              isFocus={focusedWindows[app.id]}
              isMinimized={isMinimized[app.id]}
              isOpenInAnotherWorkspace={isOpenInAnotherWorkspace}
              handleClick={() => openOrFocusApp(app.id)}
            />
          );
        })}
      </div>

      <div className="mb-6">
        <ShowApplicationsButton
          toggleAllApps={toggleAllApps}
          isActive={isAllAppsOpen}
        />
      </div>
    </div>
  );
}

function ShowApplicationsButton({
  toggleAllApps,
  isActive,
}: Readonly<{
  toggleAllApps: () => void;
  isActive: boolean;
}>) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      className={`w-10 h-10 m-1 rounded flex items-center justify-center relative cursor-pointer transition-all ${
        isActive ? "bg-white/20" : "hover:bg-white/10"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={toggleAllApps}
    >
      <Image
        src="/system/view-app-grid-symbolic.svg"
        alt="Show Applications"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <div
        className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded-md shadow border border-gray-700 transition-opacity duration-150 ${
          hovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        Show Applications
      </div>
    </button>
  );
}
