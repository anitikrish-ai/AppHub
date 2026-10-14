"use client";

import { useEffect, useRef } from "react";

/**
 * Global SVG filter definitions for:
 * 1. Liquid Goo metaball thresholding (#liquid-goo)
 * 2. Knockout mask thresholding (#liquid-remove-black)
 * 3. Procedural Liquid Glass refraction (#liquid-glass-filter)
 */
export default function LiquidFilterDefs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate the procedural normal displacement map for liquid glass
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = 256;
    const h = 128;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    // Radius for rounded rect SDF
    const radius = 48;
    const rimWidth = 24;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;

        // Centered coordinates
        const cx = x - w / 2;
        const cy = y - h / 2;
        const halfW = w / 2 - 8;
        const halfH = h / 2 - 8;

        // Signed distance to rounded rectangle
        const qx = Math.abs(cx) - (halfW - radius);
        const qy = Math.abs(cy) - (halfH - radius);
        const dist =
          Math.min(Math.max(qx, qy), 0) +
          Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2) -
          radius;

        let dx = 0;
        let dy = 0;

        if (dist < 0 && dist > -rimWidth) {
          // Inside refractive rim
          const factor = Math.sin(((dist + rimWidth) / rimWidth) * Math.PI);
          const angle = Math.atan2(cy, cx);
          dx = Math.cos(angle) * factor * 28;
          dy = Math.sin(angle) * factor * 28;
        }

        // Encode to RGB (128 is zero displacement)
        data[idx] = Math.max(0, Math.min(255, 128 + dx)); // R = X shift
        data[idx + 1] = Math.max(0, Math.min(255, 128 + dy)); // G = Y shift
        data[idx + 2] = 128; // B neutral
        data[idx + 3] = 255; // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const feImage = document.getElementById("liquid-glass-map");
    if (feImage) {
      feImage.setAttribute("href", canvas.toDataURL("image/png"));
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-50 h-0 w-0 overflow-hidden opacity-0"
    >
      <canvas ref={canvasRef} className="hidden" />
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Liquid Goo Filter for Gooey Toggle Button */}
          <filter id="liquid-goo" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 19 -8
              "
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          {/* Liquid Remove Black / Knockout Filter */}
          <filter id="liquid-remove-black" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -255 -255 -255 0 1
              "
              result="black-pixels"
            />
            <feMorphology in="black-pixels" operator="dilate" radius="0.5" result="smoothed" />
            <feComposite in="SourceGraphic" in2="smoothed" operator="out" />
          </filter>

          {/* Liquid Glass Dynamic Refraction Filter */}
          <filter id="liquid-glass-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feImage id="liquid-glass-map" result="displacementMap" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
