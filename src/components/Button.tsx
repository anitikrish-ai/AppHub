"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "glass";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-hover shadow-[var(--shadow-sm)]",
  secondary:
    "bg-bg-elevated text-text-primary border border-border hover:border-border-strong shadow-[var(--shadow-sm)]",
  ghost: "bg-transparent text-text-primary hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  glass: "glass text-text-primary shadow-[var(--shadow-sm)]",
};

// Apple HIG-style tactile spring: critically damped by default (no overshoot),
// with a soft bouncy recoil only on the hover scale-up — the momentum comes
// from the gesture (hover), not a scripted keyframe.
const hoverSpring = { type: "spring" as const, stiffness: 300, damping: 20 };
const tapSpring = { type: "spring" as const, stiffness: 500, damping: 30 };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={hoverSpring}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-medium cursor-pointer select-none",
          variantClasses[variant],
          fullWidth && "w-full",
          className
        )}
        style={{ transitionProperty: "background-color, border-color, box-shadow" }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { tapSpring, hoverSpring };
export default Button;
