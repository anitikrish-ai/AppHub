import type { Metadata } from "next";
import UploadForm from "./UploadForm";
import { fetchCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Developer Portal — Submit Your App | AppHub",
  description:
    "Publish your desktop software, creative utilities, and developer tools to thousands of eager users on AppHub.",
};

export default async function UploadPage() {
  const categories = await fetchCategories();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12 lg:px-0">
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand">
          Developer Program
        </span>
        <h1 className="text-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Publish your software on AppHub
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Distribute your desktop application to creators, engineers, and power users.
          Every submission is verified by AppHub Gatekeeper within 24–48 hours.
        </p>
      </div>

      <UploadForm categories={categories} />
    </div>
  );
}
