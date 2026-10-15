import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="liquid-glass-medium relative flex flex-col items-center gap-6 max-w-md rounded-lg p-10 border border-border shadow-[var(--shadow-lg)] overflow-hidden" style={{ borderRadius: "var(--radius-lg)" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/40 dark:border-white/10"
        />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Compass size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-brand">
            404 Error
          </span>
          <h1 className="text-display text-2xl sm:text-3xl font-semibold text-text-primary">
            Page Not Found
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            The application or page you requested could not be found. It may have been
            renamed, unlisted, or moved.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-2.5 text-xs font-semibold text-on-brand hover:bg-brand-hover transition-colors shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Return to AppHub Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
