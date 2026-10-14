"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AppIcon from "./AppIcon";
import Badge from "./Badge";
import Rating from "./Rating";
import Button from "./Button";

export interface AppCardData {
  slug: string;
  name: string;
  developerName: string;
  category: string;
  rating: number;
  iconUrl?: string | null;
}

export default function AppCard({ app }: { app: AppCardData }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass flex flex-col gap-3.5 rounded-lg p-4.5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]"
      style={{ padding: 18, borderRadius: "var(--radius-lg)" }}
    >
      <Link href={`/app/${app.slug}`} className="flex items-center gap-3">
        <AppIcon name={app.name} iconUrl={app.iconUrl} size={52} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-heading text-[15px] font-semibold text-text-primary">
            {app.name}
          </h3>
          <p className="truncate text-xs text-text-secondary">
            {app.developerName}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Badge>{app.category}</Badge>
        <Rating value={app.rating} />
      </div>
      <Button variant="primary" fullWidth className="!py-2.5 text-[13px]">
        Download
      </Button>
    </motion.div>
  );
}
