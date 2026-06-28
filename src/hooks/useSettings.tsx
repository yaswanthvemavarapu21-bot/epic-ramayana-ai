import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type TextSize = 0 | 1 | 2;

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  textSize: TextSize;
  setTextSize: (v: TextSize) => void;
  sound: boolean;
  setSound: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

const STORAGE_KEY = "ramayana-settings-v1";

const readInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { darkMode: true, textSize: 1 as TextSize, sound: true };
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const initial = typeof window !== "undefined" ? readInitial() : { darkMode: true, textSize: 1 as TextSize, sound: true };
  const [darkMode, setDarkMode] = useState<boolean>(initial.darkMode);
  const [textSize, setTextSize] = useState<TextSize>(initial.textSize);
  const [sound, setSound] = useState<boolean>(initial.sound);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ darkMode, textSize, sound })
      );
    } catch {
      /* ignore */
    }
  }, [darkMode, textSize, sound]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [darkMode]);

  // Apply text size via root font-size scaling
  useEffect(() => {
    const sizes = ["14px", "16px", "18px"];
    document.documentElement.style.fontSize = sizes[textSize];
  }, [textSize]);

  return (
    <SettingsContext.Provider
      value={{ darkMode, setDarkMode, textSize, setTextSize, sound, setSound }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};
