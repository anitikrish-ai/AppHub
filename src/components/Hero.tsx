"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Move } from "lucide-react";
import Button from "./Button";
import HeroCanvas from "./HeroCanvas";
import LiquidGlass from "./LiquidGlass";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax fade and scale as the hero leaves viewport
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog") || document.getElementById("categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={ref}
      className="relative mx-6 overflow-hidden rounded-lg lg:mx-12"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <HeroCanvas />

      <motion.div
        style={{ opacity, scale, y }}
        className="liquid-glass-strong relative flex flex-col items-start gap-6 px-8 py-16 sm:px-14 sm:py-20"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.05 }}
            className="flex items-center gap-2"
          >
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">
              Curated Independent Software
            </span>
          </motion.div>

          {/* Interactive Liquid Glass Draggable Lens Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          >
            <LiquidGlass
              draggable
              variant="pill"
              intensity="strong"
              className="flex items-center gap-2 text-xs font-medium text-text-primary border border-white/50 dark:border-white/20 select-none cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            >
              <Sparkles size={13} className="text-brand shrink-0 animate-spin-slow" />
              <span>Interactive Liquid Glass Lens</span>
              <span className="text-text-tertiary hidden sm:inline flex items-center gap-1 font-mono text-[10px]">
                <Move size={10} /> drag me
              </span>
            </LiquidGlass>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.12 }}
          className="text-display max-w-xl text-4xl font-semibold text-text-primary sm:text-6xl"
        >
          Discover your next favorite app
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.18 }}
          className="max-w-md text-base text-text-secondary sm:text-lg"
        >
          High-performance tools, creative studios, and indie gems — verified for security and ready to download in one click.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.24 }}
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          <Button variant="primary" onClick={scrollToCatalog}>
            Explore apps
          </Button>
          <a
            href="/upload"
            className="inline-flex items-center justify-center rounded-pill border border-border bg-bg-elevated/80 px-5 py-3 text-sm font-medium text-text-primary hover:border-border-strong hover:bg-bg-elevated transition-colors shadow-[var(--shadow-sm)]"
          >
            Submit your software
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
