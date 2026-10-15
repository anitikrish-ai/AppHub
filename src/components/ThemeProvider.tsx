"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Mirrors whatever ThemeScript already committed to the DOM pre-paint.
  const [theme, setTheme] = useState<Theme>("light");
  const themeRef = useRef<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    const t: Theme = current === "dark" ? "dark" : "light";
    themeRef.current = t;
    setTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === "dark" ? "light" : "dark";
    themeRef.current = next;
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("apphub-theme", next);
    } catch {
      // storage can throw in private browsing; theme still works for this tab
    }
    setTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
