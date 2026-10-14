import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppIcon from "@/components/AppIcon";
import Badge from "@/components/Badge";
import Rating from "@/components/Rating";
import Button from "@/components/Button";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import ReviewCard from "@/components/ReviewCard";
import DownloadButton from "./DownloadButton";

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("apps")
    .select(
      "id, name, tagline, description, icon_url, average_rating, rating_count, download_count, size_mb, price_cents, categories(name), developers(company_name)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!app) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, body, created_at, profiles(display_name, username)")
    .eq("app_id", app.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const developerName =
    (app.developers as unknown as { company_name: string } | null)
      ?.company_name ?? "Unknown developer";
  const categoryName =
    (app.categories as unknown as { name: string } | null)?.name ??
    "Uncategorized";

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-14 px-6 py-14 lg:px-0">
      {/* Header */}
      <div className="flex flex-col items-start gap-7 sm:flex-row">
        <AppIcon name={app.name} iconUrl={app.icon_url} size={120} />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <h1 className="text-display text-3xl font-semibold text-text-primary sm:text-4xl">
            {app.name}
          </h1>
          <p className="text-lg text-text-secondary">by {developerName}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{categoryName}</Badge>
            <Rating value={app.average_rating ?? 0} />
            <span className="text-xs text-text-tertiary">
              {app.size_mb ? `${app.size_mb} MB` : ""}
            </span>
            <span className="text-xs text-text-tertiary">
              {Intl.NumberFormat("en", { notation: "compact" }).format(
                app.download_count ?? 0
              )}{" "}
              downloads
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <DownloadButton appId={app.id} slug={slug} />
          <span className="text-xs text-text-tertiary">
            {app.price_cents === 0 ? "Free" : `$${(app.price_cents / 100).toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Screenshots */}
      <ScreenshotGallery />

      {/* Description */}
      <section className="flex flex-col gap-3">
        <h2 className="text-heading text-xl font-semibold text-text-primary">
          About this app
        </h2>
        <p className="max-w-3xl text-[15px] leading-relaxed text-text-secondary">
          {app.description}
        </p>
      </section>

      {/* Reviews */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-heading text-xl font-semibold text-text-primary">
            Ratings & reviews
          </h2>
          <Button variant="secondary" className="!px-4 !py-2 text-sm">
            Write a review
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {(reviews ?? []).length === 0 && (
            <p className="text-sm text-text-secondary">
              No reviews yet — be the first to share your thoughts.
            </p>
          )}
          {(reviews ?? []).map((r, i) => {
            const profile = r.profiles as unknown as {
              display_name: string | null;
              username: string;
            } | null;
            return (
              <ReviewCard
                key={i}
                name={profile?.display_name ?? profile?.username ?? "Anonymous"}
                rating={r.rating}
                body={r.body ?? ""}
                date={new Date(r.created_at).toLocaleDateString()}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
