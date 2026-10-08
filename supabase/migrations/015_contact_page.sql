-- ============================================================
-- Migration 015: Contact Page Content & Contact Offices
-- Tables: contact_page_content, contact_offices
-- ============================================================

-- 1. Table: contact_page_content (Section: 'hero')
CREATE TABLE IF NOT EXISTS contact_page_content (
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

CREATE INDEX IF NOT EXISTS idx_contact_page_content_key 
  ON contact_page_content (section_key);

ALTER TABLE contact_page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_contact_page_content 
  ON contact_page_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_contact_page_content 
  ON contact_page_content 
  USING (auth.role() = 'service_role');

-- 2. Table: contact_offices (Repeatable cards: Office, Corporate Head Office, Customer Happiness Center)
CREATE TABLE IF NOT EXISTS contact_offices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label               TEXT NOT NULL,
  company_name        TEXT,
  address             TEXT NOT NULL,
  phone               TEXT NOT NULL,
  email               TEXT NOT NULL,
  display_order       INTEGER NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_offices_order 
  ON contact_offices (display_order ASC);

ALTER TABLE contact_offices ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_contact_offices 
  ON contact_offices 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_contact_offices 
  ON contact_offices 
  USING (auth.role() = 'service_role');
