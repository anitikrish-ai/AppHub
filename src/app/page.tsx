import Hero from "@/components/Hero";
import AppCatalog from "@/components/AppCatalog";
import { fetchCategories, fetchPublishedApps } from "@/lib/data";

export default async function HomePage() {
  const [categories, apps] = await Promise.all([
    fetchCategories(),
    fetchPublishedApps(),
  ]);

  return (
    <div className="flex flex-col gap-14 pb-24 pt-6">
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <AppCatalog initialCategories={categories} initialApps={apps} />
      </section>
    </div>
  );
}
