"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function recordDownload(appId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("downloads").insert({
    app_id: appId,
    user_id: user?.id ?? null,
  });

  revalidatePath(`/app/${slug}`);
}
