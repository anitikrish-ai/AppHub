import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppCard, { type AppCardData } from "@/components/AppCard";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [{ data: profile }, { data: favorites }, { data: downloads }] =
    await Promise.all([
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
      developerName: row.developers?.company_name ?? "Unknown developer",
      category: row.categories?.name ?? "Uncategorized",
      rating: row.average_rating ?? 0,
      iconUrl: row.icon_url,
    };
  };

  const favoriteApps = (favorites ?? [])
    .map((f) => mapApp(f.apps))
    .filter((a): a is AppCardData => a !== null);

  const downloadedApps = (downloads ?? [])
    .map((d) => mapApp(d.apps))
    .filter((a): a is AppCardData => a !== null);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6 py-14 lg:px-0">
      <div className="flex items-center gap-5">
        <span className="h-20 w-20 rounded-full bg-gradient-to-br from-brand to-[#5e5ce6]" />
        <div>
          <h1 className="text-display text-2xl font-semibold text-text-primary sm:text-3xl">
            {profile?.display_name ?? profile?.username}
          </h1>
          <p className="text-text-secondary">@{profile?.username}</p>
        </div>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="text-heading text-xl font-semibold text-text-primary">
          Favorites
        </h2>
        {favoriteApps.length === 0 ? (
          <p className="text-sm text-text-secondary">No favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {favoriteApps.map((app) => (
              <AppCard key={app.slug} app={app} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-heading text-xl font-semibold text-text-primary">
          Download history
        </h2>
        {downloadedApps.length === 0 ? (
          <p className="text-sm text-text-secondary">No downloads yet.</p>
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
