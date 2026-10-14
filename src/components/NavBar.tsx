"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Search, Menu, X, User } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchNav, setSearchNav] = useState("");
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchNav.trim()) {
      router.push(`/#catalog`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 liquid-glass border-b border-white/20 dark:border-white/10"
      animate={{
        boxShadow: scrolled ? "var(--shadow-md)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="h-7 w-7 rounded-md bg-gradient-to-br from-brand to-[#5e5ce6] shadow-sm flex items-center justify-center text-white font-bold text-xs">
              A
            </span>
            <span className="text-heading text-[18px] font-semibold text-text-primary">
              AppHub
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
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

        <div className="flex items-center gap-3.5">
          {/* Quick Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden items-center gap-2 rounded-pill border border-border bg-bg-elevated/70 px-3.5 py-1.5 text-sm text-text-primary sm:flex shadow-[var(--shadow-sm)] focus-within:border-brand transition-colors"
          >
            <Search size={15} className="text-text-tertiary" />
            <input
              type="text"
              value={searchNav}
              onChange={(e) => setSearchNav(e.target.value)}
              placeholder="Search store…"
              className="w-36 lg:w-48 bg-transparent text-xs text-text-primary placeholder:text-text-tertiary outline-none"
            />
          </form>

          {/* Theme Switcher */}
          <ThemeToggle />

          {/* Account Profile Link */}
          <Link
            href="/account"
            aria-label="User Account"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-secondary hover:text-text-primary hover:border-brand/50 transition-colors shadow-sm"
          >
            <User size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-bg-elevated text-text-primary md:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="border-b border-border bg-bg-elevated/95 px-6 py-5 md:hidden backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-text-primary hover:text-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border flex flex-col gap-3">
                <Link
                  href="/upload"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-pill bg-brand py-2.5 text-center text-sm font-semibold text-on-brand"
                >
                  Submit App
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-pill border border-border py-2.5 text-center text-sm font-medium text-text-primary"
                >
                  My Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
