"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";

interface LiquidToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcons?: boolean;
}

export default function LiquidToggle({
  checked,
  onChange,
  label = "Toggle theme",
  size = "md",
  className,
  showIcons = true,
}: LiquidToggleProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [animating, setAnimating] = useState(false);
  const progressRef = useRef(checked ? 100 : 0);
  const animFrameRef = useRef<number | null>(null);

  // Dimensions based on size prop
  const config = {
    sm: { width: 54, height: 28, border: 3, iconSize: 12 },
    md: { width: 68, height: 34, border: 4, iconSize: 14 },
    lg: { width: 84, height: 42, border: 5, iconSize: 17 },
  }[size];

  // Spring animation transition
  const animateTo = useCallback((target: number) => {
    setAnimating(true);
    const start = progressRef.current;
    const diff = target - start;
    const startTime = performance.now();
    const duration = 400; // ms

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Apple-style damped elastic ease-out
      const ease =
        t === 1
          ? 1
          : 1 - Math.pow(2, -10 * t) * Math.cos(((t * 10 - 0.75) * (2 * Math.PI)) / 3);

      const current = start + diff * ease;
      progressRef.current = current;

      const btn = document.getElementById(`liquid-toggle-${label.replace(/\s+/g, "-")}`);
      if (btn) {
        btn.style.setProperty("--complete", current.toFixed(2));
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        progressRef.current = target;
        setAnimating(false);
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(step);
  }, [label]);

  useEffect(() => {
    animateTo(checked ? 100 : 0);
  }, [checked, animateTo]);

  const handleToggle = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 240);
    onChange(!checked);
  };

  const id = `liquid-toggle-${label.replace(/\s+/g, "-")}`;

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={handleToggle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={clsx("liquid-toggle select-none transition-transform active:scale-95", className)}
      style={
        {
          "--width": config.width,
          "--height": config.height,
          "--border": `${config.border}px`,
          "--complete": checked ? 100 : 0,
        } as React.CSSProperties
      }
      data-pressed={isPressed}
      data-active={animating || isPressed}
    >
      {/* Outer knockout mask track */}
      <div className="knockout">
        <div className="indicator indicator--masked">
          <div className="mask" />
        </div>
      </div>

      {/* Gooey Liquid Layer */}
      <div className="indicator__liquid">
        <div className="shadow" />
        <div className="wrapper">
          <div className="liquids">
            <div className="liquid__shadow" />
            <div className="liquid__track" />
          </div>
        </div>
        <div className="cover flex items-center justify-center">
          {showIcons && (
            <div className="relative flex items-center justify-center text-text-primary transition-transform duration-300">
              <Sun
                size={config.iconSize}
                className={clsx(
                  "absolute transition-all duration-300",
                  checked ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100 text-[#ff9f0a]"
                )}
              />
              <Moon
                size={config.iconSize}
                className={clsx(
                  "absolute transition-all duration-300",
                  checked ? "opacity-100 rotate-0 scale-100 text-[#0a84ff]" : "opacity-0 -rotate-90 scale-50"
                )}
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
