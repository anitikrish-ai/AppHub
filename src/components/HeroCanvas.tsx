"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

interface Orb {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
}

/**
 * A soft, slow-drifting gradient-orb field drawn on canvas behind the hero.
 * Kept subtle and slow (well under the ~0.2Hz threshold Apple flags as
 * uncomfortable) and fully paused under prefers-reduced-motion.
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const palette =
      theme === "dark"
        ? [210, 260, 150] // blue, violet, mint hues on near-black
        : [210, 260, 340]; // blue, violet, pink hues on off-white

    const orbs: Orb[] = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 120 + Math.random() * 160,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      hue: palette[i % palette.length],
    }));

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = height + orb.r;
        if (orb.y > height + orb.r) orb.y = -orb.r;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r
        );
        const alpha = theme === "dark" ? 0.22 : 0.16;
        gradient.addColorStop(0, `hsla(${orb.hue}, 90%, 65%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${orb.hue}, 90%, 65%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
