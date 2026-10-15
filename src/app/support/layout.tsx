import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support & FAQ — AppHub Help Center",
  description:
    "Find answers to common questions about AppHub software installation, developer verification, review times, and contact support.",
  alternates: { canonical: "/support" },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
