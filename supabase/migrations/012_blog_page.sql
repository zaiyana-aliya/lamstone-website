-- ============================================================
-- Migration 012: Blog Page Content
-- Table: blog_page_content
-- Sections: 'hero'
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_page_content (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key         TEXT UNIQUE NOT NULL,
  eyebrow_label       TEXT,
  heading             TEXT NOT NULL,
  description         TEXT NOT NULL DEFAULT '',
  image_url           TEXT,
  primary_cta_label   TEXT,
  primary_cta_url     TEXT,
  extra_data          JSONB DEFAULT '{}'::jsonb,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_page_content_key 
  ON blog_page_content (section_key);

-- Enable Row Level Security
ALTER TABLE blog_page_content ENABLE ROW LEVEL SECURITY;

-- Public read policy: active rows only
CREATE POLICY public_read_active_blog_page_content 
  ON blog_page_content 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend API & admin panel
CREATE POLICY service_role_blog_page_content 
  ON blog_page_content 
  USING (auth.role() = 'service_role');
