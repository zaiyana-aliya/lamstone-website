-- ============================================================
-- Migration 016: Site-Wide Footer Content
-- Table: footer_content
-- ============================================================

CREATE TABLE IF NOT EXISTS footer_content (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key               TEXT UNIQUE NOT NULL DEFAULT 'main',
  company_description       TEXT NOT NULL DEFAULT '',
  phone                     TEXT NOT NULL DEFAULT '',
  email                     TEXT NOT NULL DEFAULT '',
  office_address            TEXT NOT NULL DEFAULT '',
  corporate_office_address  TEXT NOT NULL DEFAULT '',
  social_links              JSONB NOT NULL DEFAULT '{"facebook": "", "instagram": "", "linkedin": ""}'::jsonb,
  copyright_text            TEXT NOT NULL DEFAULT '',
  quick_links               JSONB NOT NULL DEFAULT '[]'::jsonb,
  newsletter_heading        TEXT DEFAULT 'Newsletter',
  newsletter_description    TEXT DEFAULT 'Subscribe for the latest healthcare insights and product updates.',
  is_active                 BOOLEAN NOT NULL DEFAULT true,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_footer_content_key 
  ON footer_content (section_key);

ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- Public read for active footer content
CREATE POLICY public_read_active_footer_content 
  ON footer_content 
  FOR SELECT 
  USING (is_active = true);

-- Service role full access for admin mutations
CREATE POLICY service_role_footer_content 
  ON footer_content 
  USING (auth.role() = 'service_role');
