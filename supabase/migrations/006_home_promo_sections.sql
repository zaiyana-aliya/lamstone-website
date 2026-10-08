-- ============================================================
-- Migration 006: Home Promo Sections (Lamé & Invest Banners)
-- Table: home_promo_sections
-- ============================================================

CREATE TABLE IF NOT EXISTS home_promo_sections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key         TEXT UNIQUE NOT NULL,
  eyebrow_label       TEXT NOT NULL,
  heading             TEXT NOT NULL,
  description         TEXT NOT NULL,
  image_url           TEXT NOT NULL,
  primary_cta_label   TEXT NOT NULL,
  primary_cta_url     TEXT NOT NULL,
  secondary_cta_label TEXT,
  secondary_cta_url   TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_home_promo_sections_key 
  ON home_promo_sections (section_key);

-- Enable RLS
ALTER TABLE home_promo_sections ENABLE ROW LEVEL SECURITY;

-- Public read policy: active sections only
CREATE POLICY "public_read_active_home_promo_sections" 
  ON home_promo_sections 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend & admin
CREATE POLICY "service_role_home_promo_sections" 
  ON home_promo_sections 
  USING (auth.role() = 'service_role');
