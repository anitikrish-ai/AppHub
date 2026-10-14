import { createClient } from "@/lib/supabase/server";
import UploadForm from "./UploadForm";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-14 lg:px-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Submit a new app
        </h1>
        <p className="text-lg text-text-secondary">
          Fill in the details below. Your submission is reviewed within 2
          business days.
        </p>
      </div>
      <UploadForm categories={categories ?? []} />
    </div>
  );
}
