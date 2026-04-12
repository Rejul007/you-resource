-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts
create table if not exists posts (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  subject text not null,
  topics text not null,
  author_name text not null,
  author_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Full-text search index on posts
alter table posts add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(subject,'') || ' ' || coalesce(topics,''))
  ) stored;
create index if not exists posts_search_idx on posts using gin(search_vector);

-- Resources
create table if not exists resources (
  id text primary key default gen_random_uuid()::text,
  post_id text references posts(id) on delete cascade not null,
  url text not null,
  title text not null,
  description text not null,
  language text not null,
  price text not null,
  type text not null,
  submitted_by text not null,
  submitted_by_id uuid references auth.users(id) on delete set null,
  votes integer default 0,
  created_at timestamptz default now()
);

-- Full-text search on resources
alter table resources add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(type,''))
  ) stored;
create index if not exists resources_search_idx on resources using gin(search_vector);

-- Comments
create table if not exists comments (
  id text primary key default gen_random_uuid()::text,
  post_id text references posts(id) on delete cascade not null,
  parent_id text references comments(id) on delete cascade,
  content text not null,
  author_name text not null,
  author_id uuid references auth.users(id) on delete set null,
  votes integer default 0,
  created_at timestamptz default now()
);

-- User profiles (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable Realtime on tables
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table resources;

-- Row Level Security
alter table posts enable row level security;
alter table resources enable row level security;
alter table comments enable row level security;
alter table profiles enable row level security;

-- Policies: anyone can read
create policy "Public read posts" on posts for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read comments" on comments for select using (true);
create policy "Public read profiles" on profiles for select using (true);

-- Policies: authenticated users can insert
create policy "Auth insert posts" on posts for insert with check (auth.uid() = author_id);
create policy "Auth insert resources" on resources for insert with check (auth.uid() = submitted_by_id);
create policy "Auth insert comments" on comments for insert with check (auth.uid() = author_id);

-- Policies: users can update/delete their own
create policy "Auth update posts" on posts for update using (auth.uid() = author_id);
create policy "Auth update resources" on resources for update using (true); -- votes
create policy "Auth update comments" on comments for update using (true); -- votes
create policy "Auth upsert profiles" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
