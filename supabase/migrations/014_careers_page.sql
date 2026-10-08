-- ============================================================
-- Migration 014: Careers Page Content & Culture Values
-- Tables: careers_page_content, careers_culture_values
-- ============================================================

-- 1. Table: careers_page_content (Sections: 'hero', 'culture_intro')
CREATE TABLE IF NOT EXISTS careers_page_content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key         TEXT UNIQUE NOT NULL,
  eyebrow_label       TEXT,
  heading             TEXT NOT NULL,
  description         TEXT NOT NULL DEFAULT '',
  image_url           TEXT,
  primary_cta_label   TEXT,
  primary_cta_url     TEXT,
  secondary_cta_label TEXT,
  secondary_cta_url   TEXT,
  extra_data          JSONB DEFAULT '{}'::jsonb,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_careers_page_content_key 
  ON careers_page_content (section_key);

ALTER TABLE careers_page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_careers_page_content 
  ON careers_page_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_careers_page_content 
  ON careers_page_content 
  USING (auth.role() = 'service_role');

-- 2. Table: careers_culture_values (Repeatable cards: Inclusive Culture, Accelerated Pathways, Community Impact)
CREATE TABLE IF NOT EXISTS careers_culture_values (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon                TEXT NOT NULL DEFAULT 'Users',
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  display_order       INTEGER NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_careers_culture_values_order 
  ON careers_culture_values (display_order ASC);

ALTER TABLE careers_culture_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_careers_culture_values 
  ON careers_culture_values 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_careers_culture_values 
  ON careers_culture_values 
  USING (auth.role() = 'service_role');
