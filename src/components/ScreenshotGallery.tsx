"use client";

import { motion } from "framer-motion";

const palette = [
  ["#8b5cf6", "#ec4899"],
  ["#0ea5e9", "#14b8a6"],
  ["#f97316", "#ef4444"],
  ["#22c55e", "#0d9488"],
];

export default function ScreenshotGallery({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: count }).map((_, i) => {
        const [from, to] = palette[i % palette.length];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 280, damping: 24, delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="h-[380px] w-[220px] shrink-0 rounded-md"
            style={{
              borderRadius: "var(--radius-md)",
              background: `linear-gradient(145deg, ${from}, ${to})`,
            }}
          />
        );
      })}
    </div>
  );
}
