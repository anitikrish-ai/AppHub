"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "./Button";
import HeroCanvas from "./HeroCanvas";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle scroll-triggered parallax: fade + scale down as the hero leaves
  // the viewport, rather than a hard cut.
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div
      ref={ref}
      className="relative mx-6 overflow-hidden rounded-lg lg:mx-12"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <HeroCanvas />
      <motion.div
        style={{ opacity, scale, y }}
        className="glass-strong relative flex flex-col items-start gap-5 px-8 py-16 sm:px-14 sm:py-20"
      >
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.05 }}
          className="text-xs font-semibold uppercase tracking-wide text-text-tertiary"
        >
          Featured this week
        </motion.span>
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
          Thousands of apps, games, and tools — reviewed by a real community
          and ready to download in one click.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.24 }}
        >
          <Button variant="primary">Explore apps</Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
