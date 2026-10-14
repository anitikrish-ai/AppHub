-- ==============================================================================
-- AppHub Database Schema & Initial Seed
-- PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  is_developer boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. DEVELOPERS TABLE
create table if not exists public.developers (
  id uuid references public.profiles(id) on delete cascade primary key,
  company_name text not null,
  website text,
  support_email text,
  verified boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.developers enable row level security;

create policy "Developers are viewable by everyone"
  on public.developers for select
  using (true);

create policy "Developers can update their own record"
  on public.developers for update
  using (auth.uid() = id);

-- 3. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

-- 4. APPS TABLE
create table if not exists public.apps (
  id uuid default uuid_generate_v4() primary key,
  developer_id uuid references public.developers(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text unique not null,
  tagline text,
  description text,
  icon_url text,
  build_file_url text,
  version text default '1.0.0' not null,
  price_cents integer default 0 not null,
  size_mb numeric(8,2),
  download_count integer default 0 not null,
  average_rating numeric(3,2) default 5.0 not null,
  rating_count integer default 0 not null,
  status text default 'in_review' not null check (status in ('draft', 'in_review', 'published', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.apps enable row level security;

create policy "Published apps are viewable by everyone"
  on public.apps for select
  using (status = 'published' or auth.uid() = developer_id);

create policy "Developers can insert apps"
  on public.apps for insert
  with check (auth.uid() = developer_id);

create policy "Developers can update their apps"
  on public.apps for update
  using (auth.uid() = developer_id);

-- 5. APP SCREENSHOTS TABLE
create table if not exists public.app_screenshots (
  id uuid default uuid_generate_v4() primary key,
  app_id uuid references public.apps(id) on delete cascade not null,
  image_url text not null,
  sort_order integer default 0 not null
);

alter table public.app_screenshots enable row level security;

create policy "Screenshots viewable by everyone"
  on public.app_screenshots for select
  using (true);

-- 6. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  app_id uuid references public.apps(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reviews enable row level security;

create policy "Reviews viewable by everyone"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- 7. FAVORITES TABLE
create table if not exists public.favorites (
  user_id uuid references public.profiles(id) on delete cascade not null,
  app_id uuid references public.apps(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, app_id)
);

alter table public.favorites enable row level security;

create policy "Users can view and manage their own favorites"
  on public.favorites for all
  using (auth.uid() = user_id);

-- 8. DOWNLOADS TABLE
create table if not exists public.downloads (
  id uuid default uuid_generate_v4() primary key,
  app_id uuid references public.apps(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.downloads enable row level security;

create policy "Downloads viewable by user"
  on public.downloads for select
  using (auth.uid() = user_id or auth.uid() is null);

create policy "Anyone can record a download"
  on public.downloads for insert
  with check (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

insert into public.categories (name, slug) values
  ('Productivity', 'productivity'),
  ('Developer Tools', 'developer-tools'),
  ('Utilities', 'utilities'),
  ('Graphics & Design', 'graphics-design'),
  ('Audio & Music', 'audio-music'),
  ('Games', 'games')
on conflict (slug) do nothing;
