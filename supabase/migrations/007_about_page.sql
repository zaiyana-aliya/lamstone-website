-- ============================================================
-- Migration 007: About Page Content (Hero, Story, Vision, Mission)
-- Table: about_page_content
-- ============================================================

CREATE TABLE IF NOT EXISTS about_page_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key   TEXT UNIQUE NOT NULL,
  eyebrow_label TEXT NOT NULL,
  heading       TEXT NOT NULL,
  description   TEXT NOT NULL,
  image_url     TEXT,
  cta_label     TEXT,
  cta_url       TEXT,
  extra_data    JSONB DEFAULT '{}'::jsonb,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_page_content_key 
  ON about_page_content (section_key);

-- Enable Row Level Security
ALTER TABLE about_page_content ENABLE ROW LEVEL SECURITY;

-- Public read policy: active rows only
CREATE POLICY public_read_active_about_page_content 
  ON about_page_content 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend API & admin panel
CREATE POLICY service_role_about_page_content 
  ON about_page_content 
  USING (auth.role() = 'service_role');
