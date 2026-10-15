"use client";

import { motion } from "framer-motion";

const screenshots = [
  {
    title: "Workspace View",
    bg: "from-[#1e1b4b] to-[#312e81]",
    accent: "#6366f1",
    subtitle: "Distraction-free editing canvas",
  },
  {
    title: "Analytics Dashboard",
    bg: "from-[#064e3b] to-[#047857]",
    accent: "#10b981",
    subtitle: "Real-time telemetry and metrics",
  },
  {
    title: "Command Palette",
    bg: "from-[#1c1917] to-[#292524]",
    accent: "#f59e0b",
    subtitle: "Instant keyboard-first workflows",
  },
  {
    title: "Security & Encryption",
    bg: "from-[#3b0764] to-[#581c87]",
    accent: "#a855f7",
    subtitle: "Zero-knowledge cryptographic vault",
  },
];

export default function ScreenshotGallery() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-heading text-xl font-semibold text-text-primary">
        Previews & screenshots
      </h2>
      <div className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
        {screenshots.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
              delay: i * 0.06,
            }}
            whileHover={{ y: -6 }}
            className="flex h-[280px] w-[360px] sm:w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-border bg-bg-elevated shadow-[var(--shadow-md)]"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            {/* Window Title Bar */}
            <div className="flex items-center justify-between border-b border-border/80 bg-bg-elevated/90 px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[11px] font-medium text-text-tertiary">
                {s.title}
              </span>
              <div className="w-10" />
            </div>

            {/* Mock Screen Content */}
            <div
              className={`flex-1 bg-gradient-to-br ${s.bg} p-6 flex flex-col justify-between text-white`}
            >
              <div className="space-y-3">
                <div className="inline-block rounded-pill bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur-md">
                  Preview 0{i + 1}
                </div>
                <h4 className="text-lg font-semibold tracking-tight">{s.title}</h4>
                <p className="text-xs text-white/70 max-w-[280px]">{s.subtitle}</p>
              </div>

              {/* Mock UI widgets */}
              <div className="space-y-2 rounded-lg bg-black/20 p-3.5 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between text-[11px] text-white/60">
                  <span>Status</span>
                  <span className="text-white font-medium">Active</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${60 + i * 12}%`, background: s.accent }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
