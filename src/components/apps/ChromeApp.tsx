"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface Tab {
  url: string;
  display_url: string;
  favicon: string;
  history: string[];
  historyIndex: number;
}

const homeUrl = "https://www.google.com/webhp?igu=1";

const extractFavicon = (url: string): string => {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  } catch {
    return `https://www.google.com/s2/favicons?sz=64&domain_url=https://www.google.com`;
  }
};

const isURL = (str: string): boolean => /^(http|https):\/\//.test(str);

const smartParse = (input: string): string => {
  if (!isURL(input)) input = "https://" + input;
  try {
    new URL(input);
    return input;
  } catch {
    return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
  }
};

const createDefaultTab = (): Tab => ({
  url: homeUrl,
  display_url: "https://www.google.com",
  favicon: extractFavicon(homeUrl),
  history: [homeUrl],
  historyIndex: 0,
});

const generateTabUpdate = (input: string, currentTab: Tab): Tab => {
  let parsedUrl = smartParse(input);

  if (
    parsedUrl.includes("google.com") &&
    !parsedUrl.includes("search?q=") &&
    !input.toLowerCase().includes("google.com/search")
  ) {
    parsedUrl = homeUrl;
  }

  const display_url = new URL(parsedUrl).origin;

  return {
    ...currentTab,
    url: parsedUrl,
    display_url,
    favicon: extractFavicon(parsedUrl),
    history: [
      ...currentTab.history.slice(0, currentTab.historyIndex + 1),
      parsedUrl,
    ],
    historyIndex: currentTab.historyIndex + 1,
  };
};

const ChromeApp: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [tabs, setTabs] = useState<Tab[]>([createDefaultTab()]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const currentTab = tabs[currentTabIndex] ?? createDefaultTab();
  const [urlInput, setUrlInput] = useState(currentTab.display_url);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedTabs = localStorage.getItem("chrome-tabs");
    const storedIndex = localStorage.getItem("chrome-current-tab");

    if (storedTabs) {
      const parsedTabs = JSON.parse(storedTabs);
      setTabs(parsedTabs.length ? parsedTabs : [createDefaultTab()]);
      setCurrentTabIndex(Number(storedIndex) || 0);
    }
  }, []);

  useEffect(() => {
    if (tabs[currentTabIndex]) {
      setUrlInput(tabs[currentTabIndex].display_url);
    }
  }, [tabs, currentTabIndex]);

  useEffect(() => {
    localStorage.setItem("chrome-tabs", JSON.stringify(tabs));
    localStorage.setItem("chrome-current-tab", String(currentTabIndex));
  }, [tabs, currentTabIndex]);

  const updateTab = (updatedTab: Tab) => {
    setTabs((prev) => {
      const newTabs = [...prev];
      newTabs[currentTabIndex] = updatedTab;
      return newTabs;
    });
  };

  const addNewTab = () => {
    setTabs((prev) => [...prev, createDefaultTab()]);
    setCurrentTabIndex(tabs.length);
  };

  const handleCloseTab = (index: number) => {
    setTabs((prevTabs) => {
      const updatedTabs = [...prevTabs];
      updatedTabs.splice(index, 1);

      let nextIndex = currentTabIndex;

      if (updatedTabs.length === 0) {
        setCurrentTabIndex(0);
        return [createDefaultTab()];
      }

      if (index === currentTabIndex) {
        nextIndex = index === 0 ? 0 : index - 1;
      } else if (index < currentTabIndex) {
        nextIndex = currentTabIndex - 1;
      }

      setCurrentTabIndex(nextIndex);
      return updatedTabs;
    });
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const updatedTab = generateTabUpdate(urlInput.trim(), currentTab);
    updateTab(updatedTab);
    setLoading(true);
  };

  const goBack = () => {
    if (currentTab.historyIndex > 0) {
      const idx = currentTab.historyIndex - 1;
      const url = currentTab.history[idx];
      updateTab({
        ...currentTab,
        url,
        display_url: new URL(url).origin,
        favicon: extractFavicon(url),
        historyIndex: idx,
      });
      setUrlInput(new URL(url).origin);
      setLoading(true);
    }
  };

  const goForward = () => {
    if (currentTab.historyIndex < currentTab.history.length - 1) {
      const idx = currentTab.historyIndex + 1;
      const url = currentTab.history[idx];
      updateTab({
        ...currentTab,
        url,
        display_url: new URL(url).origin,
        favicon: extractFavicon(url),
        historyIndex: idx,
      });
      setUrlInput(new URL(url).origin);
      setLoading(true);
    }
  };

  const goHome = () => {
    const updatedTab = generateTabUpdate(homeUrl, currentTab);
    updateTab(updatedTab);
    setUrlInput(updatedTab.display_url);
    setLoading(true);
  };

  const refreshPage = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentTab.url;
      setLoading(true);
    }
  };

  const handleIframeLoad = () => {
    setLoading(false);
    const iframe = iframeRef.current;

    try {
      const newUrl = iframe?.contentWindow?.location.href;
      if (!newUrl || newUrl === currentTab.url) return;

      const display_url = new URL(newUrl).origin;
      const favicon = extractFavicon(newUrl);

      const updatedTab: Tab = {
        ...currentTab,
        url: newUrl,
        display_url,
        favicon,
        history: [
          ...currentTab.history.slice(0, currentTab.historyIndex + 1),
          newUrl,
        ],
        historyIndex: currentTab.historyIndex + 1,
      };

      updateTab(updatedTab);
      setUrlInput(display_url);
    } catch {
      // Cross-origin navigation, can't read location.href — expected for Google, YouTube etc.
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#2E2E2E] text-white font-ubuntu text-sm rounded-b-md">
      {/* Tabs */}
      <div className="flex bg-[#1E1E1E] border-b border-gray-700 px-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md cursor-pointer transition-all relative
            ${
              i === currentTabIndex
                ? "bg-[#333333] shadow-inner"
                : "hover:bg-[#2a2a2a]"
            }`}
          >
            <div
              onClick={() => setCurrentTabIndex(i)}
              className="flex items-center gap-2"
            >
              <Image src={tab.favicon} width={16} height={16} alt="" />
              <span className="truncate max-w-[120px]">{tab.display_url}</span>
            </div>
            <button
              onClick={() => handleCloseTab(i)}
              className="ml-1 text-gray-400 hover:text-red-500 font-bold"
              title="Close Tab"
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addNewTab} className="text-green-400 px-2">
          +
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252525] border-b border-gray-700">
        <button onClick={goBack}>
          <ArrowLeft size={16} />
        </button>
        <button onClick={goForward}>
          <ArrowRight size={16} />
        </button>
        <button onClick={refreshPage}>
          <Image
            src="/status/chrome_refresh.svg"
            width={16}
            height={16}
            alt="Refresh"
          />
        </button>
        <button onClick={goHome}>
          <Image
            src="/status/chrome_home.svg"
            width={16}
            height={16}
            alt="Home"
          />
        </button>
        <Image src={currentTab.favicon} width={16} height={16} alt="icon" />
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={handleEnter}
          className="flex-grow bg-[#1e1e1e] text-white rounded-full px-4 py-1 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
          spellCheck={false}
        />
      </div>

      {loading && <div className="h-0.5 bg-blue-500 animate-pulse" />}

      <iframe
        ref={iframeRef}
        key={currentTab.url}
        src={currentTab.url}
        onLoad={handleIframeLoad}
        className="flex-grow border-none"
      />
    </div>
  );
};

export default ChromeApp;
