"use client";

import SettingsApp from "@/components/apps/SettingsApp";
import React, { useEffect, useState } from "react";

export default function SettingsAppWrapper() {
  const [bgName, setBgName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("backgroundImage") || "wall-14";
    }
    return "wall-14";
  });

  useEffect(() => {
    const handle = () => {
      const updated = localStorage.getItem("backgroundImage") || "wall-14";
      setBgName(updated);
    };
    window.addEventListener("changeBackground", handle);
    return () => window.removeEventListener("changeBackground", handle);
  }, []);

  const updateBackground = (name: string) => {
    localStorage.setItem("backgroundImage", name);
    window.dispatchEvent(new Event("changeBackground"));
  };

  return <SettingsApp currBgImgName={bgName} changeBackgroundImage={updateBackground} />;
}
