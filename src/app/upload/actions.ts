"use server";

import { redirect } from "next/navigation";
import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { addInMemorySubmission, type AppItem } from "@/lib/data";

export type UploadState = { error?: string; success?: boolean; slug?: string } | undefined;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function submitApp(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const name = (formData.get("name") as string)?.trim();
  const companyName = (formData.get("company_name") as string)?.trim() || "Independent Developer";
  const categoryId = formData.get("category_id") as string;
  const description = (formData.get("description") as string)?.trim();
  const tagline = (formData.get("tagline") as string)?.trim() || "";
  const version = (formData.get("version") as string)?.trim() || "1.0.0";
  const priceInput = formData.get("price") as string;
  const priceCents = priceInput ? Math.round(parseFloat(priceInput) * 100) : 0;

  if (!name || !description) {
    return { error: "Application name and description are required." };
  }

  const generatedSlug = `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`;
  let targetSlug = generatedSlug;

  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Ensure developer profile
        const { data: existingDev } = await supabase
          .from("developers")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (!existingDev) {
          await supabase
            .from("developers")
            .insert({ id: user.id, company_name: companyName });
        }

        const { data: inserted, error } = await supabase
          .from("apps")
          .insert({
            developer_id: user.id,
            category_id: categoryId || null,
            name,
            tagline,
            version,
            price_cents: priceCents,
            slug: generatedSlug,
            description,
            status: "in_review",
          })
          .select("slug")
          .single();

        if (error) {
          return { error: error.message };
        }

        if (inserted?.slug) {
          targetSlug = inserted.slug;
        }
      }
    } catch {
      // safe fallback
    }
  }

  // Also store in memory so the author can immediately view the submission preview
  const newSubmission: AppItem = {
    id: `app-sub-${Date.now()}`,
    name,
    slug: targetSlug,
    tagline,
    description,
    developerName: companyName,
    categoryName: "Productivity",
    categorySlug: "productivity",
    averageRating: 5.0,
    ratingCount: 1,
    downloadCount: 0,
    sizeMb: 28.4,
    priceCents,
    iconUrl: null,
    status: "in_review",
    version,
    buildFileUrl: null,
  };

  addInMemorySubmission(newSubmission);

  redirect(`/app/${targetSlug}`);
}
