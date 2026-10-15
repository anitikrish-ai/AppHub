"use client";

import { motion } from "framer-motion";
import AppCard, { type AppCardData } from "./AppCard";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 24 },
  },
};

export default function AppGrid({ apps }: { apps: AppCardData[] }) {
  if (apps.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        No apps published yet — be the first to submit one.
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {apps.map((app) => (
        <motion.div key={app.slug} variants={item}>
          <AppCard app={app} />
        </motion.div>
      ))}
    </motion.div>
  );
}
