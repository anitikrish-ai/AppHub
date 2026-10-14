import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import CategoryChips from "@/components/CategoryChips";
import AppGrid from "@/components/AppGrid";
import type { AppCardData } from "@/components/AppCard";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: apps }] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase
      .from("apps")
      .select(
        "slug, name, icon_url, average_rating, categories(name), developers(company_name)"
      )
      .eq("status", "published")
      .order("download_count", { ascending: false })
      .limit(8),
  ]);

  const cards: AppCardData[] = (apps ?? []).map((a) => ({
    slug: a.slug,
    name: a.name,
    developerName:
      (a.developers as unknown as { company_name: string } | null)
        ?.company_name ?? "Unknown developer",
    category:
      (a.categories as unknown as { name: string } | null)?.name ??
      "Uncategorized",
    rating: a.average_rating ?? 0,
    iconUrl: a.icon_url,
  }));

  return (
    <div className="flex flex-col gap-16 pb-24 pt-8">
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <CategoryChips categories={categories ?? []} />
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-heading text-2xl font-semibold text-text-primary">
            Popular right now
          </h2>
          <a
            href="#"
            className="text-sm font-medium text-brand hover:text-brand-hover"
          >
            See all
          </a>
        </div>
        <AppGrid apps={cards} />
      </section>
    </div>
  );
}
