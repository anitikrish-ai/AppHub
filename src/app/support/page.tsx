"use client";

import { useState } from "react";
import { HelpCircle, Mail, Clock, ShieldCheck, Check } from "lucide-react";
import Button from "@/components/Button";

const faqs = [
  {
    question: "How do I submit software to AppHub?",
    answer:
      "Navigate to the Developer Portal via the 'Developers' link in the top navigation. Fill in your studio information, app metadata, upload screenshots, and provide your release package (.dmg, .pkg, .zip, or .exe). You can test submissions instantly.",
  },
  {
    question: "How long does the Gatekeeper review process take?",
    answer:
      "Our automated Gatekeeper security scan runs immediately upon upload to check binary signatures and scan for common vulnerabilities. Human editorial review is completed within 24–48 hours.",
  },
  {
    question: "How are security and binary integrity verified?",
    answer:
      "Every package hosted on AppHub undergoes cryptographic hash checksum verification, static code heuristic scanning, and dynamic sandboxing before being marked with the Gatekeeper Verified seal.",
  },
  {
    question: "How do developers monetize software on AppHub?",
    answer:
      "Developers can offer their software as free open-source releases, one-time paid purchases, or free-to-download with direct licensing keys. AppHub supports transparent pricing with zero surprise platform cuts.",
  },
  {
    question: "What is the refund and satisfaction guarantee policy?",
    answer:
      "We offer a 14-day hassle-free refund window on all paid application purchases if the software fails to perform as advertised or encounters fundamental incompatibilities with your operating system.",
  },
];

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-14 px-6 py-12 lg:px-0">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Help Center & FAQs
        </span>
        <h1 className="text-display text-3xl font-semibold text-text-primary sm:text-5xl">
          How can we help you?
        </h1>
        <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
          Browse frequently asked questions regarding downloads, verification, and submissions,
          or get in touch directly with our curation team.
        </p>
      </div>

      {/* Response Time Promise Card */}
      <div className="liquid-glass-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg p-6 border border-white/20 dark:border-white/10 shadow-[var(--shadow-sm)]" style={{ borderRadius: "var(--radius-md)" }}>
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Response-Time Promise
            </h3>
            <p className="text-xs text-text-secondary">
              Our engineering support team replies to all developer inquiries within 24 hours.
            </p>
          </div>
        </div>

        <a
          href="mailto:support@apphub.dev"
          className="inline-flex items-center gap-1.5 rounded-pill border border-border bg-bg-elevated px-4 py-2 text-xs font-semibold text-text-primary hover:border-brand/40 transition-colors"
        >
          <Mail size={13} />
          <span>support@apphub.dev</span>
        </a>
      </div>

      {/* Frequently Asked Questions */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <HelpCircle size={20} className="text-brand" />
          <h2 className="text-heading text-xl font-semibold text-text-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="liquid-glass-subtle flex flex-col gap-2 rounded-lg p-5 border border-white/20 dark:border-white/10"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <h3 className="text-[15px] font-semibold text-text-primary flex items-start gap-2.5">
                <span className="text-brand font-mono text-xs mt-0.5">0{i + 1}.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact Form */}
      <section className="liquid-glass-medium relative flex flex-col gap-6 rounded-lg p-8 border border-border shadow-[var(--shadow-sm)] overflow-hidden" style={{ borderRadius: "var(--radius-lg)" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/30 dark:border-white/10"
        />
        <div>
          <h2 className="text-heading text-xl font-semibold text-text-primary">
            Send a Message to Support
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Questions regarding an application, developer verification, or report a bug.
          </p>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
            <Check size={16} />
            <span>Thank you! Your message has been sent. We&apos;ll reply within 24 hours.</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
            (e.target as HTMLFormElement).reset();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                className="w-full rounded-md border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@example.com"
                className="w-full rounded-md border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
                style={{ borderRadius: "var(--radius-md)" }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Issue installing Nebula Notes on macOS Tahoe"
              className="w-full rounded-md border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1">
              Message
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain how we can help you…"
              className="w-full rounded-md border border-border bg-bg-elevated px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand"
              style={{ borderRadius: "var(--radius-md)" }}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-text-tertiary flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-success" />
              <span>Encrypted transmission</span>
            </span>
            <Button type="submit" variant="primary" className="!px-6 !py-2.5 text-xs font-semibold">
              Send Message
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
