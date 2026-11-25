-- ==========================================
-- SUPABASE SCHEMA FOR PORTFOLIO (SECURED)
-- ==========================================
-- IMPORTANT : remplacez ADMIN_EMAIL ci-dessous par l'email
-- du compte Supabase Auth qui administre le site.
-- Ensuite, dans le dashboard Supabase :
--   Authentication -> Sign In / Providers -> désactivez
--   "Allow new users to sign up".

-- ==========================================
-- ADMIN CHECK FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(auth.jwt() ->> 'email', '') = 'kafabdssamad58@gmail.com';
$$;

-- ==========================================
-- 1. Projects Table
-- ==========================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  title_en VARCHAR(100),
  description TEXT,
  description_en TEXT,
  long_description TEXT,
  long_description_en TEXT,
  tech_stack TEXT[],
  category VARCHAR(50),        -- 'Web' | 'Mobile' | '3D' | 'Design'
  image_url TEXT,
  project_images TEXT[],       -- Array of additional image URLs
  github_url TEXT,
  has_github BOOLEAN DEFAULT true,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Certificates Table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  issuer VARCHAR(100) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id VARCHAR(100),
  credential_url TEXT,
  image_url TEXT,
  category VARCHAR(50),       -- 'Dev' | 'Cloud' | 'Design' | 'Other'
  description TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. CV Table
CREATE TABLE cv (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT NOT NULL,
  version VARCHAR(20),
  language VARCHAR(5),        -- 'fr' | 'en'
  is_active BOOLEAN DEFAULT true,
  download_count INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Contact Messages Table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Site Stats Table
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(50),
  visitor_id TEXT,
  country TEXT,
  device VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- PROJECTS POLICIES
-- Public can read all projects
DROP POLICY IF EXISTS "Public read access on projects" ON projects;
CREATE POLICY "Public read access on projects"
ON projects FOR SELECT
TO public USING (true);

-- Only the admin user can write
DROP POLICY IF EXISTS "Admin full access on projects" ON projects;
CREATE POLICY "Admin full access on projects"
ON projects FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- CERTIFICATES POLICIES
DROP POLICY IF EXISTS "Public read access on certificates" ON certificates;
CREATE POLICY "Public read access on certificates"
ON certificates FOR SELECT
TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on certificates" ON certificates;
CREATE POLICY "Admin full access on certificates"
ON certificates FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- CV POLICIES
DROP POLICY IF EXISTS "Public read active cv" ON cv;
CREATE POLICY "Public read active cv"
ON cv FOR SELECT
TO public USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access on cv" ON cv;
CREATE POLICY "Admin full access on cv"
ON cv FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- MESSAGES POLICIES
-- No public INSERT: the contact form uses EmailJS.
-- If you later want DB storage for messages, add an Edge Function instead.
DROP POLICY IF EXISTS "Public can insert messages" ON messages;
DROP POLICY IF EXISTS "Public insert messages" ON messages;

DROP POLICY IF EXISTS "Admin full access on messages" ON messages;
CREATE POLICY "Admin full access on messages"
ON messages FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- STATS POLICIES
-- Public can insert stats (tracking visits). This is required for the
-- visit tracker, but be aware it can be abused for spam inserts.
-- For stronger protection, move tracking to an Edge Function with rate limiting.
DROP POLICY IF EXISTS "Public can insert stats" ON stats;
CREATE POLICY "Public can insert stats"
ON stats FOR INSERT
TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on stats" ON stats;
CREATE POLICY "Admin full access on stats"
ON stats FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- SKILLS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon_key VARCHAR(100),
  color VARCHAR(20),
  level VARCHAR(20),
  featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_all_skills" ON skills;
CREATE POLICY "admin_all_skills" ON skills FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- EXPERIENCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,          -- 'stage' | 'formation'
  degree VARCHAR(200),
  degree_en VARCHAR(200),
  school VARCHAR(200),
  location VARCHAR(100),
  period VARCHAR(100),
  description TEXT,
  description_en TEXT,
  highlights TEXT[],
  highlights_en TEXT[],
  badge VARCHAR(50),
  badge_en VARCHAR(50),
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_all_experiences" ON experiences;
CREATE POLICY "admin_all_experiences" ON experiences FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- ACTIVITIES TABLE (Parascolaires)
-- ==========================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),        -- 'Club' | 'Competition' | 'Event' | 'Volunteering'
  date_start DATE,
  date_end DATE,
  location VARCHAR(100),
  images TEXT[],                -- Array of image URLs
  cover_image_index INT DEFAULT 0,  -- Index of the cover image in the images array
  is_active BOOLEAN DEFAULT true,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active activities" ON activities;
CREATE POLICY "Public read active activities"
ON activities FOR SELECT
TO public USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access on activities" ON activities;
CREATE POLICY "Admin full access on activities"
ON activities FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ==========================================
-- CV DOWNLOAD COUNTER (public-safe RPC)
-- ==========================================
-- Public cannot UPDATE cv directly; this function only increments
-- the counter for a given CV id. Safe to expose to anonymous users.
CREATE OR REPLACE FUNCTION public.increment_cv_download(cv_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE cv SET download_count = download_count + 1 WHERE id = cv_id;
$$;

-- ==========================================
-- SITE SETTINGS & HOME CONTENT TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access on site_settings" ON site_settings;
CREATE POLICY "Public read access on site_settings"
ON site_settings FOR SELECT
TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on site_settings" ON site_settings;
CREATE POLICY "Admin full access on site_settings"
ON site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Optional bilingual columns for activities & certificates
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_en VARCHAR(150);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS title_en VARCHAR(150);
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS description_en TEXT;

-- ==========================================
-- STORAGE POLICIES (Supabase Storage)
-- ==========================================

-- Public can VIEW files (read-only)
DROP POLICY IF EXISTS "Public view access" ON storage.objects;
CREATE POLICY "Public view access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img', 'activities-img'));

-- Only the admin user can upload/update/delete files
DROP POLICY IF EXISTS "Admin full access on storage" ON storage.objects;
CREATE POLICY "Admin full access on storage"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img', 'activities-img')
  AND public.is_admin()
)
WITH CHECK (
  bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img', 'activities-img')
  AND public.is_admin()
);
