"use client";

import BootingScreen from "@/components/screens/BootingScreen";
import DesktopScreen from "@/components/screens/Desktop";
import LockScreen from "@/components/screens/LockScreen";
import { useEffect, useState } from "react";

export default function UbuntuDesktop() {
  const [bootingScreen, setBootingScreen] = useState(true);
  const [shutDownScreen, setShutDownScreen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [bgImgName, setBgImgName] = useState("wall-14");

  // Initial load: sync localStorage values
  useEffect(() => {
    const bg = localStorage.getItem("backgroundImage");
    if (bg) setBgImgName(bg);

    const shut = localStorage.getItem("shut-down");
    if (shut === "true") {
      shutDown();
    } else {
      const locked = localStorage.getItem("screen-locked");
      setIsLocked(locked === "true");
    }

    const alreadyVisited = localStorage.getItem("booting_screen");
    if (alreadyVisited) {
      setBootingScreen(false);
    } else {
      localStorage.setItem("booting_screen", "false");
      setTimeout(() => {
        setBootingScreen(false);
      }, 2000);
    }
  }, []);

  // Unlock listener (LockScreen handles user interaction)
  const unLockScreen = () => {
    setIsLocked(false);
    localStorage.setItem("screen-locked", "false");
  };

  const lockScreen = () => {
    // Slight delay allows UI to close windows first
    setTimeout(() => {
      setIsLocked(true);
      localStorage.setItem("screen-locked", "true");
    }, 100);
  };

  const shutDown = () => {
    setShutDownScreen(true);
    localStorage.setItem("shut-down", "true");
  };

  const turnOn = () => {
    setShutDownScreen(false);
    setBootingScreen(true);
    setTimeout(() => {
      setBootingScreen(false);
    }, 2000);
    localStorage.setItem("shut-down", "false");
  };

  const changeBackgroundImage = (imgName: string) => {
    setBgImgName(imgName);
    localStorage.setItem("backgroundImage", imgName);
  };

  return (
    <div
      id="monitor-screen"
      className="w-screen h-screen overflow-hidden relative"
    >
      <BootingScreen
        visible={bootingScreen}
        isShutDown={shutDownScreen}
        turnOn={turnOn}
      />
      <LockScreen
        isLocked={isLocked}
        bgImgName={bgImgName}
        unLockScreen={unLockScreen}
      />
      {!bootingScreen && !shutDownScreen && (
        <DesktopScreen
          bgImageName={bgImgName}
          changeBackgroundImage={changeBackgroundImage}
          lockScreen={lockScreen}
          shutDown={shutDown}
        />
      )}
    </div>
  );
}
