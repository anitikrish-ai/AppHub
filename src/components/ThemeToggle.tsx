"use client";

import { useTheme } from "./ThemeProvider";
import LiquidToggle from "./LiquidToggle";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <LiquidToggle
        checked={theme === "dark"}
        onChange={toggleTheme}
        size="sm"
        showIcons
        label="Switch theme mode"
      />
    </div>
  );
}
