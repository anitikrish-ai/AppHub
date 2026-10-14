"use client";

import { useTheme } from "./ThemeProvider";
import LiquidToggle from "./LiquidToggle";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center">
      <LiquidToggle
        checked={isDark}
        onChange={toggleTheme}
        size="sm"
        label="Switch theme mode"
      />
    </div>
  );
}
