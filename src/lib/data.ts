import { createClient, isSupabaseServerConfigured } from "@/lib/supabase/server";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface AppItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  developerName: string;
  categoryName: string;
  categorySlug: string;
  averageRating: number;
  ratingCount: number;
  downloadCount: number;
  sizeMb: number | null;
  priceCents: number;
  iconUrl: string | null;
  status: string;
  version: string;
  buildFileUrl: string | null;
}

export interface ReviewItem {
  id: string;
  appId: string;
  userName: string;
  rating: number;
  body: string;
  createdAt: string;
}

export const SAMPLE_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Productivity", slug: "productivity" },
  { id: "cat-2", name: "Developer Tools", slug: "developer-tools" },
  { id: "cat-3", name: "Utilities", slug: "utilities" },
  { id: "cat-4", name: "Graphics & Design", slug: "graphics-design" },
  { id: "cat-5", name: "Audio & Music", slug: "audio-music" },
  { id: "cat-6", name: "Games", slug: "games" },
];

export const SAMPLE_APPS: AppItem[] = [
  {
    id: "app-1",
    name: "Nebula Notes",
    slug: "nebula-notes",
    tagline: "Markdown workspace with biometric vault and offline sync",
    description:
      "Nebula Notes combines the speed of plain-text markdown with the luxury of modern fluid typography. Features include end-to-end local encryption, frictionless link-graph exploration, instantaneous full-text indexing, and zero-latency keyboard navigation.",
    developerName: "Orbit Software",
    categoryName: "Productivity",
    categorySlug: "productivity",
    averageRating: 4.9,
    ratingCount: 1240,
    downloadCount: 48200,
    sizeMb: 24.5,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "2.4.1",
    buildFileUrl: null,
  },
  {
    id: "app-2",
    name: "TerminalFlow",
    slug: "terminalflow",
    tagline: "GPU-accelerated terminal emulator with contextual autocomplete",
    description:
      "Engineered for engineers who live in the shell. Rendered at 120fps on modern displays with custom font glyphs, smart regex hyperlink matching, split panes, and inline image previews.",
    developerName: "Hyperion Labs",
    categoryName: "Developer Tools",
    categorySlug: "developer-tools",
    averageRating: 4.8,
    ratingCount: 890,
    downloadCount: 34100,
    sizeMb: 45.2,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "1.9.0",
    buildFileUrl: null,
  },
  {
    id: "app-3",
    name: "Pulse Monitor",
    slug: "pulse-monitor",
    tagline: "Real-time system health, thermals, and battery cycle analysis",
    description:
      "A discreet menu bar utility that gives you instant clarity on CPU temperature, GPU memory bandwidth, fan curves, and per-app energy impact.",
    developerName: "Silicon Precision",
    categoryName: "Utilities",
    categorySlug: "utilities",
    averageRating: 4.7,
    ratingCount: 412,
    downloadCount: 18900,
    sizeMb: 12.8,
    priceCents: 499,
    iconUrl: null,
    status: "published",
    version: "3.1.2",
    buildFileUrl: null,
  },
  {
    id: "app-4",
    name: "Prism Studio",
    slug: "prism-studio",
    tagline: "Vector illustration and glass UI prototyping for modern creators",
    description:
      "Create high-precision vector artwork, design systems, and fluid animations. Export clean SVG, React JSX components, and CSS tokens in a single click.",
    developerName: "Monochrome Labs",
    categoryName: "Graphics & Design",
    categorySlug: "graphics-design",
    averageRating: 4.9,
    ratingCount: 2310,
    downloadCount: 62400,
    sizeMb: 88.0,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "4.0.2",
    buildFileUrl: null,
  },
  {
    id: "app-5",
    name: "Aura Soundscapes",
    slug: "aura-soundscapes",
    tagline: "Generative ambient audio and binaural frequencies for deep focus",
    description:
      "Crafted with algorithmic acoustic synthesis. Choose from rainfall on skylights, Nordic hearth, analog synth drones, or pink noise calibrated to maximize cognitive endurance.",
    developerName: "Waveform Collective",
    categoryName: "Audio & Music",
    categorySlug: "audio-music",
    averageRating: 4.6,
    ratingCount: 340,
    downloadCount: 12300,
    sizeMb: 38.6,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "1.2.4",
    buildFileUrl: null,
  },
  {
    id: "app-6",
    name: "Chronos Focus",
    slug: "chronos-focus",
    tagline: "Minimal interval timer crafted with fluid micro-interactions",
    description:
      "Track your deep work sessions with elegance. Integrates with calendar events, provides daily flow analytics, and respects your attention with unobtrusive visual cues.",
    developerName: "Atelier Apps",
    categoryName: "Productivity",
    categorySlug: "productivity",
    averageRating: 4.8,
    ratingCount: 780,
    downloadCount: 27500,
    sizeMb: 14.1,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "2.0.0",
    buildFileUrl: null,
  },
  {
    id: "app-7",
    name: "Cosmo Orbit",
    slug: "cosmo-orbit",
    tagline: "Atmospheric orbital physics sandbox and gravitational puzzles",
    description:
      "Guide celestial bodies through gravitational lenses, dodge solar flares, and construct stable planetary orbits in a serene audio-visual simulation.",
    developerName: "Starlight Interactive",
    categoryName: "Games",
    categorySlug: "games",
    averageRating: 4.9,
    ratingCount: 1560,
    downloadCount: 51000,
    sizeMb: 142.0,
    priceCents: 299,
    iconUrl: null,
    status: "published",
    version: "1.5.0",
    buildFileUrl: null,
  },
  {
    id: "app-8",
    name: "CipherGuard",
    slug: "cipher-guard",
    tagline: "Zero-knowledge credential vault and hardware key authenticator",
    description:
      "Protect your keys, passkeys, and identity. Features biometric Touch ID unlocking, clipboard sanitization, automated breach monitoring, and local-only encrypted backups.",
    developerName: "Aegis Security",
    categoryName: "Utilities",
    categorySlug: "utilities",
    averageRating: 4.9,
    ratingCount: 3120,
    downloadCount: 74200,
    sizeMb: 19.4,
    priceCents: 0,
    iconUrl: null,
    status: "published",
    version: "5.1.0",
    buildFileUrl: null,
  },
];

export const SAMPLE_REVIEWS: Record<string, ReviewItem[]> = {
  "app-1": [
    {
      id: "rev-1",
      appId: "app-1",
      userName: "Alex Rivera",
      rating: 5,
      body: "The speed and keyboard ergonomics are completely unmatched. It replaced three separate apps for my daily workflow.",
      createdAt: "2026-03-12T10:30:00Z",
    },
    {
      id: "rev-2",
      appId: "app-1",
      userName: "Elena Rostova",
      rating: 5,
      body: "Clean typographic scale, effortless offline sync, and the biometric vault gives me total peace of mind.",
      createdAt: "2026-02-28T14:15:00Z",
    },
  ],
  "app-2": [
    {
      id: "rev-3",
      appId: "app-2",
      userName: "David Chen",
      rating: 5,
      body: "120fps rendering makes a noticeable difference when scrolling through long logs or compile outputs.",
      createdAt: "2026-03-01T09:00:00Z",
    },
  ],
  "app-3": [
    {
      id: "rev-4",
      appId: "app-3",
      userName: "Marcus Vance",
      rating: 5,
      body: "Invaluable for keeping an eye on high thermal workloads during video renders.",
      createdAt: "2026-02-15T18:20:00Z",
    },
  ],
  "app-4": [
    {
      id: "rev-5",
      appId: "app-4",
      userName: "Sophie Dubois",
      rating: 5,
      body: "Exporting directly to JSX components and SVG tokens has cut our design handoff time in half.",
      createdAt: "2026-03-10T11:45:00Z",
    },
  ],
  "app-8": [
    {
      id: "rev-6",
      appId: "app-8",
      userName: "Nathan Drake",
      rating: 5,
      body: "Fast, reliable, and truly private. The passkey support is rock-solid.",
      createdAt: "2026-03-05T08:10:00Z",
    },
  ],
};

// In-memory submitted apps storage for runtime submissions when Supabase is not configured
const inMemorySubmissions: AppItem[] = [];

export function addInMemorySubmission(app: AppItem) {
  inMemorySubmissions.unshift(app);
}

export function getInMemorySubmissionBySlug(slug: string): AppItem | undefined {
  return inMemorySubmissions.find((a) => a.slug === slug);
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("name");
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Supabase fetch failed; fallback to seed
    }
  }
  return SAMPLE_CATEGORIES;
}

export async function fetchPublishedApps(): Promise<AppItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apps")
        .select(
          "id, slug, name, tagline, description, icon_url, average_rating, rating_count, download_count, size_mb, price_cents, status, version, build_file_url, categories(name, slug), developers(company_name)"
        )
        .eq("status", "published")
        .order("download_count", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((a) => {
          const cat = a.categories as unknown as { name: string; slug: string } | null;
          const dev = a.developers as unknown as { company_name: string } | null;
          return {
            id: a.id,
            name: a.name,
            slug: a.slug,
            tagline: a.tagline,
            description: a.description,
            developerName: dev?.company_name ?? "Independent Developer",
            categoryName: cat?.name ?? "Utilities",
            categorySlug: cat?.slug ?? "utilities",
            averageRating: a.average_rating ?? 5.0,
            ratingCount: a.rating_count ?? 0,
            downloadCount: a.download_count ?? 0,
            sizeMb: a.size_mb,
            priceCents: a.price_cents ?? 0,
            iconUrl: a.icon_url,
            status: a.status,
            version: a.version,
            buildFileUrl: a.build_file_url,
          };
        });
      }
    } catch {
      // fallback
    }
  }

  // Combine sample apps with any submitted apps in memory
  return [...inMemorySubmissions.filter((a) => a.status === "published"), ...SAMPLE_APPS];
}

export async function fetchAppBySlug(slug: string): Promise<AppItem | null> {
  // Check in-memory submissions first
  const memoryMatch = inMemorySubmissions.find((a) => a.slug === slug);
  if (memoryMatch) return memoryMatch;

  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("apps")
        .select(
          "id, slug, name, tagline, description, icon_url, average_rating, rating_count, download_count, size_mb, price_cents, status, version, build_file_url, categories(name, slug), developers(company_name)"
        )
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        const cat = data.categories as unknown as { name: string; slug: string } | null;
        const dev = data.developers as unknown as { company_name: string } | null;
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          tagline: data.tagline,
          description: data.description,
          developerName: dev?.company_name ?? "Independent Developer",
          categoryName: cat?.name ?? "Utilities",
          categorySlug: cat?.slug ?? "utilities",
          averageRating: data.average_rating ?? 5.0,
          ratingCount: data.rating_count ?? 0,
          downloadCount: data.download_count ?? 0,
          sizeMb: data.size_mb,
          priceCents: data.price_cents ?? 0,
          iconUrl: data.icon_url,
          status: data.status,
          version: data.version,
          buildFileUrl: data.build_file_url,
        };
      }
    } catch {
      // fallback
    }
  }

  const sampleMatch = SAMPLE_APPS.find((a) => a.slug === slug);
  return sampleMatch ?? null;
}

export async function fetchReviewsForApp(appId: string): Promise<ReviewItem[]> {
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("id, app_id, rating, body, created_at, profiles(display_name, username)")
        .eq("app_id", appId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        return data.map((r) => {
          const prof = r.profiles as unknown as { display_name: string | null; username: string } | null;
          return {
            id: r.id,
            appId: r.app_id,
            userName: prof?.display_name ?? prof?.username ?? "Community Member",
            rating: r.rating,
            body: r.body ?? "",
            createdAt: r.created_at,
          };
        });
      }
    } catch {
      // fallback
    }
  }

  return SAMPLE_REVIEWS[appId] ?? [];
}
