"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Sun, Moon } from "lucide-react";
import clsx from "clsx";
import "./liquid-toggle.css";

gsap.registerPlugin(Draggable);

type Size = "sm" | "md" | "lg";

interface LiquidToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: Size;
  className?: string;
  /** Sun/moon glyphs on the knob (used for the theme switch). */
  showIcons?: boolean;
  /** Accent hue (0–359) of the "on" color. Default 211 (brand blue). */
  hue?: number;
  /** Springy overshoot easing. Auto-disabled for prefers-reduced-motion. */
  bounce?: boolean;
  /** Swell into the glass bubble on press. */
  bubble?: boolean;
  /** Squash/stretch the bubble with drag velocity. */
  delta?: boolean;
  /** true = continuous color mapping, false = color snaps near the end. */
  mapped?: boolean;
  disabled?: boolean;
}

const SIZES: Record<Size, { w: number; h: number; b: number; icon: number }> = {
  sm: { w: 76, h: 32, b: 3, icon: 11 },
  md: { w: 104, h: 44, b: 4, icon: 15 },
  lg: { w: 140, h: 60, b: 5, icon: 20 },
};

const TAP_MS = 250;

export default function LiquidToggle({
  checked,
  onChange,
  label = "Toggle",
  size = "md",
  className,
  showIcons = false,
  hue = 211,
  bounce = true,
  bubble = true,
  delta = true,
  mapped = false,
  disabled = false,
}: LiquidToggleProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [initial] = useState(checked ? 100 : 0); // seed only; GSAP owns --complete afterwards
  const s = SIZES[size];

  // Latest props for the long-lived GSAP handlers.
  const live = useRef({ checked, onChange, bubble, delta, bounce, disabled });
  useEffect(() => {
    live.current = { checked, onChange, bubble, delta, bounce, disabled };
  });
  const busy = useRef(false);

  // External changes of `checked` (not from our own interaction) animate in.
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || busy.current) return;
    gsap.to(btn, { "--complete": checked ? 100 : 0, duration: 0.12, overwrite: true });
  }, [checked]);

  // Disable the springy easing for reduced-motion users.
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (btn.dataset.bounce = String(live.current.bounce && !mq.matches));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [bounce]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const finish = (next: boolean) => {
      gsap.delayedCall(0.05, () => {
        btn.dataset.active = "false";
        btn.dataset.pressed = "false";
        busy.current = false;
        if (next !== live.current.checked) live.current.onChange(next);
      });
    };

    // Tap / keyboard: scale up → slide across → settle.
    const toggleState = () => {
      if (live.current.disabled || busy.current) return;
      busy.current = true;
      btn.dataset.pressed = "true";
      if (live.current.bubble) btn.dataset.active = "true";
      const next = !live.current.checked;
      const { bounce: b, bubble: bb } = live.current;
      gsap
        .timeline({ onComplete: () => finish(next) })
        .to(btn, {
          "--complete": next ? 100 : 0,
          duration: 0.12,
          delay: b && bb ? 0.18 : 0,
        });
    };

    let pressTime = 0;
    let dragBounds = 0;
    let complete = 0;
    let dragged = false;
    const proxy = document.createElement("div");

    const [drag] = Draggable.create(proxy, {
      allowContextMenu: true,
      trigger: btn,
      onPress() {
        if (live.current.disabled || busy.current) return;
        pressTime = Date.now();
        dragged = false;
        btn.dataset.active = "true";
        btn.dataset.pressed = "true";
      },
      onDragStart() {
        if (live.current.disabled || busy.current) return;
        dragged = true;
        const r = btn.getBoundingClientRect();
        dragBounds = live.current.checked ? r.left - this.pointerX : r.left + r.width - this.pointerX;
        btn.dataset.active = "true";
      },
      onDrag() {
        if (!dragged) return;
        const moved = this.x - this.startX;
        complete = gsap.utils.clamp(
          0,
          100,
          live.current.checked
            ? gsap.utils.mapRange(dragBounds, 0, 0, 100, moved)
            : gsap.utils.mapRange(0, dragBounds, 0, 100, moved)
        );
        gsap.set(btn, {
          "--complete": complete,
          ...(live.current.delta ? { "--delta": Math.min(Math.abs(this.deltaX), 12) } : {}),
        });
      },
      onDragEnd() {
        if (!dragged) return;
        busy.current = true;
        const next = complete >= 50;
        gsap.fromTo(
          btn,
          { "--complete": complete },
          { "--complete": next ? 100 : 0, duration: 0.15, onComplete: () => finish(next) }
        );
      },
      onRelease() {
        gsap.set(btn, { "--delta": 0 });
        if (dragged || live.current.disabled) return;
        if (Date.now() - pressTime <= TAP_MS) {
          toggleState();
        } else if (!busy.current) {
          btn.dataset.active = "false";
          btn.dataset.pressed = "false";
        }
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        toggleState();
      }
      if (e.key === " ") e.preventDefault(); // prevent scroll; toggle on keyup
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") toggleState();
    };
    btn.addEventListener("keydown", onKeyDown);
    btn.addEventListener("keyup", onKeyUp);

    return () => {
      drag.kill();
      gsap.killTweensOf(btn);
      btn.removeEventListener("keydown", onKeyDown);
      btn.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const iconStyle = { width: s.icon, height: s.icon };

  return (
    <button
      ref={btnRef}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      data-active="false"
      data-pressed="false"
      data-mapped={String(mapped)}
      data-bounce={String(bounce)}
      className={clsx("liquid-toggle", disabled && "opacity-50 cursor-not-allowed", className)}
      style={
        {
          "--width": s.w,
          "--height": s.h,
          "--border": `${s.b}px`,
          "--hue": hue,
          "--complete": initial,
        } as React.CSSProperties
      }
    >
      <div className="lt-knockout">
        <div className="lt-indicator lt-indicator--masked">
          <div className="lt-mask" />
        </div>
      </div>
      <div className="lt-liquid">
        <div className="lt-shadow" />
        <div className="lt-wrapper">
          <div className="lt-liquids">
            <div className="lt-liquid__shadow" />
            <div className="lt-liquid__track" />
          </div>
        </div>
        <div className="lt-cover">
          {showIcons && (
            <>
              <Sun
                style={{ ...iconStyle, gridArea: "1 / 1", color: "#ff9f0a" }}
                className={clsx("transition-all duration-300", checked ? "opacity-0 rotate-90 scale-50" : "opacity-100")}
              />
              <Moon
                style={{ ...iconStyle, gridArea: "1 / 1", color: "#0a84ff" }}
                className={clsx("transition-all duration-300", checked ? "opacity-100" : "opacity-0 -rotate-90 scale-50")}
              />
            </>
          )}
        </div>
      </div>
    </button>
  );
}
