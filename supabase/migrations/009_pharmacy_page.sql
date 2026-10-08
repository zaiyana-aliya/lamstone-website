-- ============================================================
-- Migration 009: Pharmacy Chain Page Content
-- Table: pharmacy_page_content
-- Sections: 'hero', 'redefining', 'dispensaries', 'cta_banner'
-- ============================================================

CREATE TABLE IF NOT EXISTS pharmacy_page_content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key         TEXT UNIQUE NOT NULL,
  eyebrow_label       TEXT NOT NULL,
  heading             TEXT NOT NULL,
  description         TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_pharmacy_page_content_key 
  ON pharmacy_page_content (section_key);

-- Enable Row Level Security
ALTER TABLE pharmacy_page_content ENABLE ROW LEVEL SECURITY;

-- Public read policy: active rows only
CREATE POLICY public_read_active_pharmacy_page_content 
  ON pharmacy_page_content 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend API & admin panel
CREATE POLICY service_role_pharmacy_page_content 
  ON pharmacy_page_content 
  USING (auth.role() = 'service_role');
