"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import AppCard, { type AppCardData } from "./AppCard";
import type { CategoryItem, AppItem } from "@/lib/data";

interface AppCatalogProps {
  initialCategories: CategoryItem[];
  initialApps: AppItem[];
}

export default function AppCatalog({
  initialCategories,
  initialApps,
}: AppCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [, startTransition] = useTransition();

  const categories = useMemo(() => {
    return [{ id: "all", name: "All Apps", slug: "all" }, ...initialCategories];
  }, [initialCategories]);

  const filteredApps: AppCardData[] = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialApps
      .filter((app) => {
        const matchesCategory =
          selectedCategory === "all" ||
          app.categorySlug === selectedCategory ||
          app.categoryName.toLowerCase() === selectedCategory.toLowerCase();

        const matchesQuery =
          !q ||
          app.name.toLowerCase().includes(q) ||
          app.developerName.toLowerCase().includes(q) ||
          (app.tagline && app.tagline.toLowerCase().includes(q)) ||
          (app.description && app.description.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      })
      .map((app) => ({
        slug: app.slug,
        name: app.name,
        developerName: app.developerName,
        category: app.categoryName,
        rating: app.averageRating,
        iconUrl: app.iconUrl,
        priceCents: app.priceCents,
      }));
  }, [initialApps, selectedCategory, searchQuery]);

  return (
    <div id="catalog" className="flex flex-col gap-10">
      {/* Category and Search Filter Bar */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        {/* Category Chips */}
        <div id="categories" className="flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                key={cat.id}
                type="button"
                onClick={() => {
                  startTransition(() => {
                    setSelectedCategory(cat.slug);
                  });
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={clsx(
                  "rounded-pill px-4 py-2 text-sm font-medium transition-all cursor-pointer select-none border",
                  isActive
                    ? "bg-brand text-on-brand border-brand shadow-[var(--shadow-sm)]"
                    : "liquid-glass-subtle text-text-secondary border-border hover:border-border-strong hover:text-text-primary"
                )}
              >
                {cat.name}
              </motion.button>
            );
          })}
        </div>

        {/* In-catalog Instant Search Filter */}
        <div className="relative flex items-center min-w-[260px] max-w-sm w-full">
          <Search
            size={16}
            className="absolute left-3.5 text-text-tertiary pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter apps by name or keyword…"
            className="w-full rounded-pill border border-border bg-bg-elevated/80 pl-9 pr-9 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-brand shadow-[var(--shadow-sm)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-heading text-xl sm:text-2xl font-semibold text-text-primary">
            {selectedCategory === "all"
              ? "All Published Applications"
              : categories.find((c) => c.slug === selectedCategory)?.name ?? "Apps"}
          </h2>
          <span className="rounded-pill bg-bg-elevated px-2.5 py-0.5 text-xs font-semibold text-text-secondary border border-border">
            {filteredApps.length}
          </span>
        </div>

        {searchQuery && (
          <p className="text-xs text-text-secondary">
            Results matching &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {/* Grid of Apps */}
      {filteredApps.length === 0 ? (
        <div className="liquid-glass-medium flex flex-col items-center justify-center gap-3 rounded-lg py-16 px-6 text-center border border-white/20 dark:border-white/10" style={{ borderRadius: "var(--radius-lg)" }}>
          <SlidersHorizontal size={32} className="text-text-tertiary" />
          <h3 className="text-base font-semibold text-text-primary">No apps found</h3>
          <p className="text-sm text-text-secondary max-w-sm">
            We couldn&apos;t find any applications matching your current filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-2 text-sm font-medium text-brand hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredApps.map((app) => (
              <motion.div
                key={app.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <AppCard app={app} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
