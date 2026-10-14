"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowDownToLine } from "lucide-react";
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
  priceCents?: number;
}

export default function AppCard({ app }: { app: AppCardData }) {
  const router = useRouter();

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/app/${app.slug}`);
  };

  const priceText =
    !app.priceCents || app.priceCents === 0
      ? "Get"
      : `$${(app.priceCents / 100).toFixed(2)}`;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="liquid-glass-medium group relative flex flex-col justify-between gap-4 p-5 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-lg)] transition-all overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/30 dark:border-white/10"
      />
      <Link href={`/app/${app.slug}`} className="flex flex-col gap-3.5 focus:outline-none">
        <div className="flex items-center gap-3.5">
          <AppIcon name={app.name} iconUrl={app.iconUrl} size={54} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-heading text-[15px] font-semibold text-text-primary group-hover:text-brand transition-colors">
              {app.name}
            </h3>
            <p className="truncate text-xs text-text-secondary mt-0.5">
              {app.developerName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <Badge>{app.category}</Badge>
          <Rating value={app.rating} />
        </div>
      </Link>

      <div className="pt-1 flex items-center justify-between gap-3 border-t border-border/60">
        <span className="text-xs font-semibold text-text-tertiary">
          {app.priceCents && app.priceCents > 0 ? `$${(app.priceCents / 100).toFixed(2)}` : "Free"}
        </span>

        <Button
          variant="primary"
          onClick={handleDownloadClick}
          className="!py-1.5 !px-4 text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowDownToLine size={13} />
          <span>{priceText}</span>
        </Button>
      </div>
    </motion.div>
  );
}
