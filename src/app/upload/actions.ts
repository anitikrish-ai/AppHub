"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type UploadState = { error?: string } | undefined;

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to sign in as a developer before submitting an app." };
  }

  // Ensure a developer row exists for this user (first-time submitters).
  const { data: existingDev } = await supabase
    .from("developers")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingDev) {
    const companyName = (formData.get("company_name") as string) || "Independent developer";
    const { error: devError } = await supabase
      .from("developers")
      .insert({ id: user.id, company_name: companyName });
    if (devError) return { error: devError.message };
  }

  const name = (formData.get("name") as string)?.trim();
  const categoryId = formData.get("category_id") as string;
  const description = (formData.get("description") as string)?.trim();

  if (!name || !description) {
    return { error: "App name and description are required." };
  }

  const { data: inserted, error } = await supabase
    .from("apps")
    .insert({
      developer_id: user.id,
      category_id: categoryId || null,
      name,
      slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 7)}`,
      description,
      status: "in_review",
    })
    .select("slug")
    .single();

  if (error) return { error: error.message };

  redirect(`/app/${inserted.slug}`);
}
