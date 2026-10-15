/**
 * liquid-glass — Apple-style liquid glass refraction for any element.
 * Typed, SSR-safe port of the `liquid-glass` skill module.
 *
 * Owns the SVG filter, displacement map, backdrop-filter wiring, resize
 * handling and the frosted-blur fallback for browsers that can't apply SVG
 * filters to backdrops (Safari, Firefox). Visual dressing (tint, highlights,
 * shadow) lives in globals.css.
 */

export interface LiquidGlassOptions {
  /** Displacement strength; negative = magnifying bulge. -60 subtle … -180 dramatic. */
  scale?: number;
  /** Per-channel scale stagger (prism fringe); 0 disables. */
  chroma?: number;
  /** Neutral inset as a fraction of the smaller side. */
  border?: number;
  /** Edge-curvature softness (px) of the map's gray inset. */
  mapBlur?: number;
  /** Backdrop blur (px) behind the glass interior. */
  blur?: number;
  /** Backdrop saturation boost. */
  saturate?: number;
  /** Corner radius override (px); defaults to the element's border-radius. */
  radius?: number | null;
  /** Frosted blur (px) where refraction is unsupported. */
  fallbackBlur?: number;
}

export interface LiquidGlassHandle {
  supported: boolean;
  refresh: () => void;
  destroy: () => void;
}

const SVG_NS = "http://www.w3.org/2000/svg";
let uid = 0;
let svgDefs: SVGDefsElement | null = null;
let supportedCache: boolean | null = null;

/** Chromium applies SVG filters via backdrop-filter; Safari/Firefox no-op. */
export function isLiquidGlassSupported(): boolean {
  if (supportedCache !== null) return supportedCache;
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);
  if (isSafari || isFirefox) return (supportedCache = false);
  if (!CSS.supports("backdrop-filter", "url(#lg)")) return (supportedCache = false);
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 4;
    c.getContext("2d")!.getImageData(0, 0, 1, 1);
    return (supportedCache = true);
  } catch {
    return (supportedCache = false);
  }
}

function ensureDefs(): SVGDefsElement {
  if (svgDefs && svgDefs.isConnected) return svgDefs;
  const svg = document.createElementNS(SVG_NS, "svg");
  // 0×0 (not display:none) — display:none would break feImage.
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  svg.style.pointerEvents = "none";
  svgDefs = document.createElementNS(SVG_NS, "defs");
  svg.appendChild(svgDefs);
  document.body.appendChild(svg);
  return svgDefs;
}

/**
 * Displacement map, gradient-difference method: a red L→R ramp encodes X, a
 * blue T→B ramp encodes Y. A blurred, inset 50%-gray rounded rect neutralizes
 * the interior so refraction is confined to an edge band.
 */
function makeMap(w: number, h: number, radius: number, border: number, mapBlur: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const gx = ctx.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgb(0,0,0)");
  gx.addColorStop(1, "rgb(255,0,0)");
  ctx.fillStyle = gx;
  ctx.fillRect(0, 0, w, h);

  const gy = ctx.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, "rgb(0,0,0)");
  gy.addColorStop(1, "rgb(0,0,255)");
  ctx.globalCompositeOperation = "difference";
  ctx.fillStyle = gy;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "source-over";
  const inset = border * Math.min(w, h);
  ctx.filter = `blur(${mapBlur}px)`;
  ctx.fillStyle = "rgba(128,128,128,0.93)";
  ctx.beginPath();
  ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, Math.max(radius - inset, 2));
  ctx.fill();
  ctx.filter = "none";
  return canvas.toDataURL();
}

/** Three displacement passes at staggered scales, one channel each, screen-blended → prism fringe. */
function buildFilter(id: string, scales: number[]) {
  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", "100%");
  filter.setAttribute("height", "100%");
  // Load-bearing: linearRGB would remap the map's neutral gray and ghost the backdrop.
  filter.setAttribute("color-interpolation-filters", "sRGB");

  const feImage = document.createElementNS(SVG_NS, "feImage");
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("result", "map");
  feImage.setAttribute("preserveAspectRatio", "none");
  filter.appendChild(feImage);

  const keep = [
    "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
    "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
    "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
  ];
  const channels: string[] = [];
  for (let i = 0; i < 3; i++) {
    const disp = document.createElementNS(SVG_NS, "feDisplacementMap");
    disp.setAttribute("in", "SourceGraphic");
    disp.setAttribute("in2", "map");
    disp.setAttribute("scale", String(scales[i]));
    disp.setAttribute("xChannelSelector", "R");
    disp.setAttribute("yChannelSelector", "B");
    disp.setAttribute("result", "d" + i);
    filter.appendChild(disp);

    const cm = document.createElementNS(SVG_NS, "feColorMatrix");
    cm.setAttribute("in", "d" + i);
    cm.setAttribute("type", "matrix");
    cm.setAttribute("values", keep[i]);
    cm.setAttribute("result", "c" + i);
    filter.appendChild(cm);
    channels.push("c" + i);
  }

  const blend1 = document.createElementNS(SVG_NS, "feBlend");
  blend1.setAttribute("in", channels[0]);
  blend1.setAttribute("in2", channels[1]);
  blend1.setAttribute("mode", "screen");
  blend1.setAttribute("result", "c01");
  filter.appendChild(blend1);

  const blend2 = document.createElementNS(SVG_NS, "feBlend");
  blend2.setAttribute("in", "c01");
  blend2.setAttribute("in2", channels[2]);
  blend2.setAttribute("mode", "screen");
  filter.appendChild(blend2);

  ensureDefs().appendChild(filter);
  return { filter, feImage };
}

function resolveRadius(el: Element, w: number, h: number, override: number | null | undefined) {
  if (override != null) return override;
  const raw = getComputedStyle(el).borderTopLeftRadius || "0px";
  const v = parseFloat(raw) || 0;
  return raw.trim().endsWith("%") ? (v / 100) * Math.min(w, h) : v;
}

export function liquidGlass(el: HTMLElement, opts?: LiquidGlassOptions): LiquidGlassHandle {
  const o = {
    scale: -112,
    chroma: 6,
    border: 0.07,
    mapBlur: 12,
    blur: 3,
    saturate: 1.5,
    radius: null as number | null,
    fallbackBlur: 16,
    ...opts,
  };

  if (!isLiquidGlassSupported()) {
    const frosted = `blur(${o.fallbackBlur}px) saturate(${o.saturate})`;
    el.style.backdropFilter = frosted;
    el.style.setProperty("-webkit-backdrop-filter", frosted);
    el.classList.add("lg-fallback");
    return {
      supported: false,
      refresh() {},
      destroy() {
        el.style.backdropFilter = "";
        el.style.removeProperty("-webkit-backdrop-filter");
        el.classList.remove("lg-fallback");
      },
    };
  }

  const id = "lg-filter-" + ++uid;
  const parts = buildFilter(id, [o.scale, o.scale + o.chroma, o.scale + 2 * o.chroma]);

  function refresh() {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (!w || !h) return;
    const radius = resolveRadius(el, w, h, o.radius);
    parts.feImage.setAttribute("href", makeMap(w, h, radius, o.border, o.mapBlur));
    parts.feImage.setAttribute("width", String(w));
    parts.feImage.setAttribute("height", String(h));
  }

  refresh();
  el.style.backdropFilter = `url(#${id}) blur(${o.blur}px) saturate(${o.saturate})`;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const ro = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(refresh, 120);
  });
  ro.observe(el);

  return {
    supported: true,
    refresh,
    destroy() {
      ro.disconnect();
      clearTimeout(timer);
      parts.filter.remove();
      el.style.backdropFilter = "";
    },
  };
}
