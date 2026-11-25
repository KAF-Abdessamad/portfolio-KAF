-- ==========================================
-- SITE SETTINGS & HERO PERSISTENCE MIGRATION
-- Exécutez ce script dans : 
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==========================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Active la sécurité niveau ligne (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Lecture publique autorisée (permet au portfolio public d'afficher la photo et les textes)
DROP POLICY IF EXISTS "Public read access on site_settings" ON public.site_settings;
CREATE POLICY "Public read access on site_settings"
ON public.site_settings FOR SELECT
TO public USING (true);

-- Écriture réservée à l'administrateur authentifié (kafabdssamad58@gmail.com)
DROP POLICY IF EXISTS "Admin full access on site_settings" ON public.site_settings;
CREATE POLICY "Admin full access on site_settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Insère la ligne initiale 'default' si elle n'existe pas encore
INSERT INTO public.site_settings (id, data)
VALUES ('default', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
