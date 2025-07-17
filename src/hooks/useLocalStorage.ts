import { useEffect, useRef, useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Avoid re-running on every render due to defaultValue reference
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!initialLoad.current) return;
    initialLoad.current = false;

    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // ignore
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // ignore
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
