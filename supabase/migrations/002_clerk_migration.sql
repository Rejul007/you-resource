-- Migration: Clerk auth integration
-- Changes: Drop auth.users FKs (Clerk uses string IDs), add resource_votes table,
-- drop profiles table/trigger, update RLS policies

-- 1. Drop ALL RLS policies that reference author_id / submitted_by_id columns FIRST
DROP POLICY IF EXISTS "Auth insert posts" ON posts;
DROP POLICY IF EXISTS "Auth update posts" ON posts;
DROP POLICY IF EXISTS "Auth insert resources" ON resources;
DROP POLICY IF EXISTS "Auth update resources" ON resources;
DROP POLICY IF EXISTS "Auth insert comments" ON comments;
DROP POLICY IF EXISTS "Auth update comments" ON comments;
DROP POLICY IF EXISTS "Auth upsert profiles" ON profiles;

-- 2. Drop foreign key constraints that reference auth.users
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_submitted_by_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3. Change author_id / submitted_by_id from uuid to text for Clerk string IDs
ALTER TABLE posts ALTER COLUMN author_id TYPE text USING author_id::text;
ALTER TABLE resources ALTER COLUMN submitted_by_id TYPE text USING submitted_by_id::text;
ALTER TABLE comments ALTER COLUMN author_id TYPE text USING author_id::text;

-- 4. Re-create RLS policies (permissive — auth is handled by Clerk + service role)
CREATE POLICY "Allow insert posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update posts" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow insert resources" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update resources" ON resources FOR UPDATE USING (true);
CREATE POLICY "Allow insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update comments" ON comments FOR UPDATE USING (true);

-- 5. Drop profiles table and trigger (no longer needed with Clerk)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS profiles;

-- 6. Create resource_votes table for per-user vote tracking
CREATE TABLE IF NOT EXISTS resource_votes (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  resource_id text REFERENCES resources(id) ON DELETE CASCADE NOT NULL,
  user_id text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(resource_id, user_id)
);

-- RLS for resource_votes
ALTER TABLE resource_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read resource_votes" ON resource_votes FOR SELECT USING (true);
CREATE POLICY "Auth insert resource_votes" ON resource_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth update resource_votes" ON resource_votes FOR UPDATE USING (true);
CREATE POLICY "Auth delete resource_votes" ON resource_votes FOR DELETE USING (true);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_resource_votes_resource_user ON resource_votes(resource_id, user_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);