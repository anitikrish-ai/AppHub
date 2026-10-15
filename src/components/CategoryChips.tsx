"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

export default function CategoryChips({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [active, setActive] = useState<string>("all");
  const items = [{ id: "all", name: "All" }, ...categories];

  return (
    <div id="categories" className="flex flex-wrap gap-3">
      {items.map((cat) => {
        const isActive = active === cat.id;
        return (
          <motion.button
            key={cat.id}
            onClick={() => setActive(cat.id)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={clsx(
              "rounded-pill px-4.5 py-2.5 text-sm font-medium transition-colors cursor-pointer",
              isActive
                ? "bg-brand text-on-brand"
                : "glass text-text-secondary hover:text-text-primary"
            )}
            style={{ paddingLeft: 18, paddingRight: 18 }}
          >
            {cat.name}
          </motion.button>
        );
      })}
    </div>
  );
}
