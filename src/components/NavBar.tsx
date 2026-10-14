"use client";

import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Browse", href: "/" },
  { label: "Categories", href: "/#categories" },
  { label: "Developers", href: "/upload" },
  { label: "Support", href: "/support" },
];

export default function NavBar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  // Scroll-edge effect instead of a hard 1px divider: the toolbar only picks
  // up its border/shadow once content has actually passed underneath it.
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
  });

  return (
    <motion.header
      className="sticky top-0 z-50 glass"
      animate={{
        boxShadow: scrolled ? "var(--shadow-sm)" : "0 0 0 rgba(0,0,0,0)",
        borderBottomColor: scrolled ? "var(--color-border)" : "transparent",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ borderBottom: "1px solid transparent" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3 lg:px-12">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-md bg-gradient-to-br from-brand to-[#5e5ce6]" />
            <span className="text-heading text-[17px] font-semibold text-text-primary">
              AppHub
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-pill border border-border bg-bg-elevated/70 px-4 py-2 text-sm text-text-tertiary sm:flex">
            <Search size={15} />
            <span>Search apps, games, tools…</span>
          </div>
          <ThemeToggle />
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#5e5ce6] to-[#30d158]" />
        </div>
      </div>
    </motion.header>
  );
}
