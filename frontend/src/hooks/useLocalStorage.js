import { useEffect, useState } from "react";

/**
 * useState synced with localStorage so state survives page reloads.
 * Falls back to in-memory state when localStorage is unavailable.
 */
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors (e.g. private mode / quota exceeded)
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
