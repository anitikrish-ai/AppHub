"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

interface LiquidGlassProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "panel" | "card" | "dock" | "pill";
  draggable?: boolean;
  interactiveGlint?: boolean;
  intensity?: "subtle" | "medium" | "strong";
}

export default function LiquidGlass({
  children,
  className,
  variant = "panel",
  draggable = false,
  interactiveGlint = true,
  intensity = "medium",
}: LiquidGlassProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt / glint tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 350, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveGlint || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
  };

  const variantStyles = {
    panel: "rounded-2xl p-6 shadow-[var(--shadow-md)]",
    card: "rounded-2xl p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300",
    dock: "rounded-pill px-6 py-3 shadow-[var(--shadow-lg)]",
    pill: "rounded-pill px-4 py-2 text-xs shadow-xs",
  }[variant];

  const intensityClasses = {
    subtle: "liquid-glass-subtle",
    medium: "liquid-glass-medium",
    strong: "liquid-glass-strong",
  }[intensity];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      drag={draggable}
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.12}
      whileDrag={{ scale: 1.03, cursor: "grabbing" }}
      className={clsx(
        "liquid-glass relative overflow-hidden",
        variantStyles,
        intensityClasses,
        draggable && "cursor-grab",
        className
      )}
    >
      {/* Specular Rim Highlight (Apple Glass Bevel) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/40 dark:border-white/15"
      />

      {/* Dynamic Cursor Light Glint */}
      {interactiveGlint && isHovered && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-60 dark:opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(280px circle at ${springX}px ${springY}px, rgba(255, 255, 255, 0.4), transparent 70%)`,
          }}
        />
      )}

      {/* Inner Chromatic Ambient Dispersion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/15 via-transparent to-black/10 dark:from-white/10 dark:to-black/30"
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
