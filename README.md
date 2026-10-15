# AppHub — Modern Desktop & Developer Software Store

AppHub is a curated application marketplace and distribution platform built with Next.js 16, React 19, Tailwind CSS v4, Framer Motion, and Supabase.

Designed with Apple Human Interface Guidelines aesthetics: glassmorphism, dynamic fluid micro-interactions, dark/light theme switching, and automated Gatekeeper security scanning.

---

## ✨ Features

- **Curated Software Catalog**: Instant interactive search, category filtering, and responsive grid layout.
- **Detailed Software Pages**: Real-time download packages, version metadata, specifications, and community reviews.
- **Interactive Review System**: Star rating selection and verified feedback submission.
- **Developer Publishing Portal**: Self-service submission with drag-and-drop icon, screenshot, and binary package uploaders.
- **User Library & Account**: View saved favorites, download history, and installed licenses.
- **Gatekeeper Verification**: Simulated malware and integrity scanning badges.
- **Apple HIG Design & Dark Mode**: Seamless dark/light theme with zero flash of unstyled content (blocking pre-paint script), tactile spring physics, and canvas ambient orbs.
- **Built-in Fallback Layer**: Works immediately out of the box with rich sample data even before connecting Supabase credentials.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```
Add your Supabase project URL and anon public key if connecting to a live Supabase backend.
*(If omitted, AppHub automatically uses the built-in curated data store and in-memory submission pipeline.)*

### 3. Database Setup (If using Supabase)
Execute `supabase/schema.sql` in your Supabase SQL editor to create all required tables (`profiles`, `developers`, `categories`, `apps`, `app_screenshots`, `reviews`, `favorites`, `downloads`) and configure Row Level Security (RLS) policies.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Server Actions, React Server Components)
- **UI & State**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Custom Apple HIG CSS variables
- **Motion**: [Framer Motion](https://www.framer.com/motion)
- **Icons**: [Lucide React](https://lucide.dev)
- **Backend / Database**: [Supabase](https://supabase.com) (`@supabase/ssr`, PostgreSQL)

---

## 📂 Project Structure

```
├── public/                 # Static assets, robots.txt, sitemap.xml, llms.txt
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── account/        # User library & account
│   │   ├── app/[slug]/     # Software detail, reviews, downloads
│   │   ├── support/        # Help center & FAQ
│   │   ├── upload/         # Developer submission portal
│   │   ├── layout.tsx      # Root layout & SEO metadata
│   │   ├── page.tsx        # Store homepage
│   │   └── not-found.tsx   # Custom 404 page
│   ├── components/         # Reusable UI & motion components
│   └── lib/
│       ├── data.ts         # Central data layer with fallback seed store
│       └── supabase/       # SSR browser & server Supabase clients
└── supabase/
    └── schema.sql          # PostgreSQL schema and RLS policies
```
