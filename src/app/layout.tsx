import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import ThemeScript from "@/components/ThemeScript";
import { ThemeProvider } from "@/components/ThemeProvider";
import LiquidFilterDefs from "@/components/LiquidFilterDefs";
import LiquidGlassProvider from "@/components/LiquidGlassProvider";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AppHub — Discover and Download Premium Apps",
  description:
    "Browse, download, and review curated apps, games, and tools from independent creators. Fast, secure, and beautifully designed.",
  applicationName: "AppHub",
  authors: [{ name: "AppHub Community" }],
  keywords: ["app store", "mac apps", "desktop tools", "productivity", "developer tools", "independent software"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://apphub-catalog.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AppHub — Discover and Download Premium Apps",
    description:
      "Browse, download, and review curated apps, games, and tools from independent creators.",
    url: "/",
    siteName: "AppHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AppHub — Discover and Download Premium Apps",
    description:
      "Browse, download, and review curated apps, games, and tools from independent creators.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text-primary selection:bg-brand selection:text-on-brand">
        <LiquidFilterDefs />
        <LiquidGlassProvider />
        <ThemeProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border mt-auto py-10 px-6 lg:px-12">
            <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-sm bg-gradient-to-br from-brand to-[#5e5ce6]" />
                <span className="font-semibold text-text-secondary">AppHub</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-text-secondary">
                <a href="/support" className="hover:text-text-primary transition-colors">
                  Support & FAQ
                </a>
                <a href="/upload" className="hover:text-text-primary transition-colors">
                  Developer Portal
                </a>
                <a href="mailto:support@apphub.dev" className="hover:text-text-primary transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
