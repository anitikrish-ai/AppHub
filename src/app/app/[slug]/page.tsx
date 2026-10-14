import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShieldCheck, ChevronRight, Clock, HardDrive, Download, AlertCircle } from "lucide-react";
import AppIcon from "@/components/AppIcon";
import Badge from "@/components/Badge";
import Rating from "@/components/Rating";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import DownloadButton from "./DownloadButton";
import ReviewSection from "./ReviewSection";
import { fetchAppBySlug, fetchReviewsForApp } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = await fetchAppBySlug(slug);

  if (!app) {
    return {
      title: "App Not Found — AppHub",
    };
  }

  return {
    title: `${app.name} — Download for Desktop | AppHub`,
    description: app.tagline || app.description || `Download ${app.name} on AppHub.`,
    openGraph: {
      title: `${app.name} — Download for Desktop | AppHub`,
      description: app.tagline || app.description || "",
      type: "website",
    },
  };
}

export default async function AppDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = await fetchAppBySlug(slug);

  if (!app) notFound();

  const reviews = await fetchReviewsForApp(app.id);

  const priceText =
    app.priceCents === 0 ? "Free" : `$${(app.priceCents / 100).toFixed(2)}`;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-10 lg:px-0">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-text-tertiary"
      >
        <Link href="/" className="hover:text-text-primary transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/#categories`}
          className="hover:text-text-primary transition-colors"
        >
          {app.categoryName}
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-secondary truncate max-w-[200px]">
          {app.name}
        </span>
      </nav>

      {/* Review pending banner if app is not yet published */}
      {app.status === "in_review" && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-text-primary">
          <AlertCircle size={20} className="text-warning shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-warning">
              Submission Pending Editorial Review
            </span>
            <p className="text-xs text-text-secondary">
              This app has been submitted to AppHub Gatekeeper. It is currently
              undergoing automated integrity scans and human design verification
              (estimated 24–48 hours).
            </p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center justify-between pb-8 border-b border-border">
        <div className="flex items-start gap-6">
          <AppIcon name={app.name} iconUrl={app.iconUrl} size={110} />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-display text-3xl font-semibold text-text-primary sm:text-4xl">
                {app.name}
              </h1>
              {app.status === "in_review" && (
                <span className="rounded-pill bg-warning/20 text-warning px-2.5 py-0.5 text-xs font-medium border border-warning/30">
                  In Review
                </span>
              )}
            </div>

            <p className="text-base text-text-secondary">
              by <span className="font-medium text-text-primary">{app.developerName}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Badge>{app.categoryName}</Badge>
              <Rating value={app.averageRating} />
              <span className="text-xs text-text-tertiary">
                ({app.ratingCount.toLocaleString()} ratings)
              </span>
              <span className="text-xs text-text-tertiary flex items-center gap-1">
                <HardDrive size={13} />
                {app.sizeMb ? `${app.sizeMb} MB` : "32 MB"}
              </span>
              <span className="text-xs text-text-tertiary flex items-center gap-1">
                <Download size={13} />
                {Intl.NumberFormat("en", { notation: "compact" }).format(
                  app.downloadCount
                )}{" "}
                downloads
              </span>
            </div>
          </div>
        </div>

        {/* Download & Purchase Column */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-between sm:justify-start pt-4 sm:pt-0">
          <DownloadButton
            appId={app.id}
            slug={app.slug}
            appName={app.name}
            buildFileUrl={app.buildFileUrl}
          />
          <div className="text-right">
            <span className="text-sm font-semibold text-text-primary">
              {priceText}
            </span>
            <span className="text-[11px] text-text-tertiary block">
              Version {app.version}
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Gatekeeper badge */}
      <div className="liquid-glass-subtle flex items-center gap-3 rounded-md px-4 py-3 text-xs text-text-secondary border border-white/30 dark:border-white/10" style={{ borderRadius: "var(--radius-sm)" }}>
        <ShieldCheck size={18} className="text-success shrink-0" />
        <span>
          <strong>AppHub Gatekeeper Verified:</strong> Scanned for binaries, malware, and privacy policy compliance.
        </span>
      </div>

      {/* Screenshots */}
      <ScreenshotGallery />

      {/* Description */}
      <section className="flex flex-col gap-4">
        <h2 className="text-heading text-xl font-semibold text-text-primary">
          About this software
        </h2>
        <div className="max-w-3xl space-y-4 text-[15px] leading-relaxed text-text-secondary">
          <p>{app.description}</p>
          {app.tagline && (
            <p className="font-medium text-text-primary italic">
              &ldquo;{app.tagline}&rdquo;
            </p>
          )}
        </div>
      </section>

      {/* App Metadata Specifications Table */}
      <section className="flex flex-col gap-4">
        <h2 className="text-heading text-xl font-semibold text-text-primary">
          Information
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-lg border border-border liquid-glass-medium p-5 text-xs" style={{ borderRadius: "var(--radius-md)" }}>
          <div>
            <span className="text-text-tertiary block mb-1">Developer</span>
            <span className="font-medium text-text-primary">{app.developerName}</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-1">Category</span>
            <span className="font-medium text-text-primary">{app.categoryName}</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-1">Version</span>
            <span className="font-medium text-text-primary">{app.version}</span>
          </div>
          <div>
            <span className="text-text-tertiary block mb-1">Package Size</span>
            <span className="font-medium text-text-primary">
              {app.sizeMb ? `${app.sizeMb} MB` : "32 MB"}
            </span>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection appId={app.id} slug={app.slug} initialReviews={reviews} />
    </div>
  );
}
