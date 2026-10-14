"use server";

import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordDownload(appId: string, slug: string) {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("downloads").insert({
        app_id: appId,
        user_id: user?.id ?? null,
      });

      // Increment download_count on apps table
      const { data: currentApp } = await supabase
        .from("apps")
        .select("download_count")
        .eq("id", appId)
        .single();

      if (currentApp) {
        await supabase
          .from("apps")
          .update({ download_count: (currentApp.download_count ?? 0) + 1 })
          .eq("id", appId);
      }
    } catch {
      // safe fallback
    }
  }

  try {
    revalidatePath(`/app/${slug}`);
  } catch {
    // safe
  }
}

export async function submitReviewAction(
  appId: string,
  slug: string,
  rating: number,
  body: string
) {
  if (!body.trim()) {
    return { error: "Please provide review feedback text." };
  }

  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from("reviews").insert({
          app_id: appId,
          user_id: user.id,
          rating,
          body: body.trim(),
        });
        if (error) return { error: error.message };
      }
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : "Failed to post review" };
    }
  }

  try {
    revalidatePath(`/app/${slug}`);
  } catch {
    // safe
  }

  return { success: true };
}
