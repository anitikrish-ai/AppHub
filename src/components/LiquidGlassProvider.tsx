"use client";

import { useEffect } from "react";
import {
  liquidGlass,
  type LiquidGlassHandle,
  type LiquidGlassOptions,
} from "@/lib/liquid-glass";

/**
 * Applies real liquid-glass refraction to every glass surface in the app
 * (anything carrying one of the glass classes), including ones that mount
 * later (modals, route changes). Server components keep using plain classNames.
 *
 * - Refraction is attached only while an element is near the viewport, so a
 *   long grid of cards never holds dozens of live SVG backdrop filters.
 * - Elements too large for the effect (GPU cost) keep the CSS frosted look.
 * - Honors prefers-reduced-transparency (CSS fallback stays in charge).
 * - Glass nested inside other glass keeps the CSS frosted look.
 * - Opt out per element with data-lg="off".
 */
const SELECTOR =
  ".liquid-glass, .liquid-glass-subtle, .liquid-glass-medium, .liquid-glass-strong, .glass, .glass-strong";

const MAX_AREA = 700_000;
const MAX_SIDE = 1800;

function presetFor(el: Element): LiquidGlassOptions {
  const c = el.classList;
  if (c.contains("liquid-glass-strong") || c.contains("glass-strong"))
    return { scale: -150, chroma: 8, blur: 4, mapBlur: 14 };
  if (c.contains("liquid-glass-subtle") || c.contains("glass"))
    return { scale: -60, chroma: 4, blur: 6, border: 0.09 };
  return { scale: -112, chroma: 6, blur: 4 }; // medium / base
}

export default function LiquidGlassProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return;

    const active = new Map<HTMLElement, LiquidGlassHandle>();
    const watched = new Set<HTMLElement>();

    const attach = (el: HTMLElement) => {
      if (active.has(el) || !el.isConnected) return;
      // Nested glass only "sees" its parent's contents (backdrop root), so
      // refraction would bend nothing — leave it on the CSS frosted look.
      if (el.parentElement?.closest(SELECTOR)) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h || w * h > MAX_AREA || w > MAX_SIDE || h > MAX_SIDE) return;
      active.set(el, liquidGlass(el, presetFor(el)));
    };
    const detach = (el: HTMLElement) => {
      active.get(el)?.destroy();
      active.delete(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) attach(el);
          else detach(el);
        }
      },
      { rootMargin: "200px" }
    );

    const watch = (el: HTMLElement) => {
      if (watched.has(el) || el.dataset.lg === "off") return;
      watched.add(el);
      io.observe(el);
    };
    const unwatch = (el: HTMLElement) => {
      if (!watched.delete(el)) return;
      io.unobserve(el);
      detach(el);
    };

    const scan = (root: ParentNode) => {
      if (root instanceof HTMLElement && root.matches(SELECTOR)) watch(root);
      root.querySelectorAll<HTMLElement>(SELECTOR).forEach(watch);
    };

    const sweep = () => {
      for (const el of Array.from(watched)) {
        if (!el.isConnected || !el.matches(SELECTOR)) unwatch(el);
      }
    };

    scan(document.body);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "childList") {
          r.addedNodes.forEach((n) => n instanceof HTMLElement && scan(n));
        } else if (r.target instanceof HTMLElement) {
          if (r.target.matches(SELECTOR)) watch(r.target);
        }
      }
      sweep();
    });
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mo.disconnect();
      io.disconnect();
      active.forEach((h) => h.destroy());
      active.clear();
      watched.clear();
    };
  }, []);

  return null;
}
