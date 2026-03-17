-- ==========================================
-- SUPABASE SCHEMA FOR PORTFOLIO
-- ==========================================

-- 1. Projects Table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  long_description TEXT,
  tech_stack TEXT[],
  category VARCHAR(50),        -- 'Web' | 'Mobile' | '3D' | 'Design'
  image_url TEXT,
  github_url TEXT,
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

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- PROJECTS POLICIES
-- Public can read all projects
CREATE POLICY "Public read access on projects" 
ON projects FOR SELECT 
TO public USING (true);

-- Admin (Authenticated) can do everything
CREATE POLICY "Admin full access on projects" 
ON projects FOR ALL 
TO authenticated USING (true);


-- CERTIFICATES POLICIES
-- Public can read all certificates
CREATE POLICY "Public read access on certificates" 
ON certificates FOR SELECT 
TO public USING (true);

-- Admin (Authenticated) can do everything
CREATE POLICY "Admin full access on certificates" 
ON certificates FOR ALL 
TO authenticated USING (true);


-- CV POLICIES
-- Public can only read active CVs
CREATE POLICY "Public read active cv" 
ON cv FOR SELECT 
TO public USING (is_active = true);

-- Admin (Authenticated) can do everything
CREATE POLICY "Admin full access on cv" 
ON cv FOR ALL 
TO authenticated USING (true);


-- MESSAGES POLICIES
-- Public can insert messages (contact form)
CREATE POLICY "Public can insert messages" 
ON messages FOR INSERT 
TO public WITH CHECK (true);

-- Admin (Authenticated) can read and modify messages
CREATE POLICY "Admin full access on messages" 
ON messages FOR ALL 
TO authenticated USING (true);


-- STATS POLICIES
-- Public can insert stats (tracking visits)
CREATE POLICY "Public can insert stats" 
ON stats FOR INSERT 
TO public WITH CHECK (true);

-- Admin can read and manage stats
CREATE POLICY "Admin full access on stats" 
ON stats FOR ALL 
TO authenticated USING (true);

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

CREATE POLICY "public_read_skills" ON skills FOR SELECT USING (true);
CREATE POLICY "admin_all_skills" ON skills FOR ALL TO authenticated USING (true);

-- ==========================================
-- STORAGE POLICIES (Supabase Storage)
-- ==========================================

-- Allow Public to view files in all buckets
CREATE POLICY "Public view access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img'));

-- Allow Admin (Authenticated) to upload/view/delete files in all buckets
CREATE POLICY "Admin full access on storage" 
ON storage.objects FOR ALL 
TO authenticated 
USING (bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img'))
WITH CHECK (bucket_id IN ('portfolio-images', 'cv-files', 'certificates-img'));

