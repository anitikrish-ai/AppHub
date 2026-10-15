import type { Metadata } from "next";
import Link from "next/link";
import { Download, Heart, Package, KeyRound } from "lucide-react";
import AppCard, { type AppCardData } from "@/components/AppCard";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { SAMPLE_APPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "My Account & Library — AppHub",
  description: "Manage your downloaded software, favorites, and developer profile.",
};

export default async function AccountPage() {
  let user = null;
  let profile = null;
  let favoriteApps: AppCardData[] = [];
  let downloadedApps: AppCardData[] = [];

  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data.user;

      if (user) {
        const [{ data: prof }, { data: favs }, { data: downs }] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("favorites")
            .select("apps(slug, name, icon_url, average_rating, categories(name), developers(company_name))")
            .eq("user_id", user.id),
          supabase
            .from("downloads")
            .select("downloaded_at, apps(slug, name, icon_url, average_rating, categories(name), developers(company_name))")
            .eq("user_id", user.id)
            .order("downloaded_at", { ascending: false })
            .limit(10),
        ]);

        profile = prof;

        const mapApp = (a: unknown): AppCardData | null => {
          const row = a as {
            slug: string;
            name: string;
            icon_url: string | null;
            average_rating: number;
            categories: { name: string } | null;
            developers: { company_name: string } | null;
          } | null;
          if (!row) return null;
          return {
            slug: row.slug,
            name: row.name,
            developerName: row.developers?.company_name ?? "Independent developer",
            category: row.categories?.name ?? "Utilities",
            rating: row.average_rating ?? 5.0,
            iconUrl: row.icon_url,
          };
        };

        favoriteApps = (favs ?? [])
          .map((f) => mapApp(f.apps))
          .filter((a): a is AppCardData => a !== null);

        downloadedApps = (downs ?? [])
          .map((d) => mapApp(d.apps))
          .filter((a): a is AppCardData => a !== null);
      }
    } catch {
      // safe fallback
    }
  }

  // Fallback demo user library if not signed into Supabase
  if (!user) {
    favoriteApps = SAMPLE_APPS.slice(0, 3).map((a) => ({
      slug: a.slug,
      name: a.name,
      developerName: a.developerName,
      category: a.categoryName,
      rating: a.averageRating,
      iconUrl: a.iconUrl,
      priceCents: a.priceCents,
    }));

    downloadedApps = SAMPLE_APPS.slice(2, 6).map((a) => ({
      slug: a.slug,
      name: a.name,
      developerName: a.developerName,
      category: a.categoryName,
      rating: a.averageRating,
      iconUrl: a.iconUrl,
      priceCents: a.priceCents,
    }));
  }

  const displayName = profile?.display_name ?? (user ? "Developer User" : "Community Member");
  const username = profile?.username ?? (user ? user.email?.split("@")[0] : "apphub-explorer");

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12 lg:px-0">
      {/* Account Profile Card */}
      <div className="liquid-glass-medium relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-lg p-8 shadow-[var(--shadow-md)] overflow-hidden" style={{ borderRadius: "var(--radius-lg)" }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/40 dark:border-white/10"
        />
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-brand to-[#5e5ce6] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-display text-2xl font-semibold text-text-primary sm:text-3xl">
                {displayName}
              </h1>
              <span className="rounded-pill bg-brand/10 border border-brand/30 text-brand px-2.5 py-0.5 text-xs font-semibold">
                {user ? "Verified Account" : "Guest Explorer"}
              </span>
            </div>
            <p className="text-sm text-text-secondary">@{username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-pill bg-brand px-4 py-2 text-xs font-semibold text-on-brand shadow-sm hover:bg-brand-hover transition-colors"
          >
            <Package size={14} />
            <span>Submit Software</span>
          </Link>
        </div>
      </div>

      {/* Supabase Notice if not connected */}
      {!user && (
        <div className="flex items-start gap-3.5 rounded-lg border border-border bg-bg-elevated/60 p-4 text-xs text-text-secondary" style={{ borderRadius: "var(--radius-md)" }}>
          <KeyRound size={18} className="text-brand shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-text-primary">
              AppHub Account Sync
            </span>
            <p>
              You are currently browsing as a guest. To sync downloads, favorites, and developer submissions across devices, configure Supabase credentials in <code className="bg-bg px-1.5 py-0.5 rounded text-text-primary">.env.local</code>.
            </p>
          </div>
        </div>
      )}

      {/* Favorites Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Heart size={18} className="text-danger" />
          <h2 className="text-heading text-xl font-semibold text-text-primary">
            Favorite Applications
          </h2>
          <span className="rounded-pill bg-bg-elevated px-2 py-0.5 text-xs font-medium text-text-tertiary">
            {favoriteApps.length}
          </span>
        </div>

        {favoriteApps.length === 0 ? (
          <p className="text-sm text-text-secondary">No favorites saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>

      {/* Download History Section */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Download size={18} className="text-brand" />
          <h2 className="text-heading text-xl font-semibold text-text-primary">
            Download History & Installed Licenses
          </h2>
          <span className="rounded-pill bg-bg-elevated px-2 py-0.5 text-xs font-medium text-text-tertiary">
            {downloadedApps.length}
          </span>
        </div>

        {downloadedApps.length === 0 ? (
          <p className="text-sm text-text-secondary">No recorded downloads yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {downloadedApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
