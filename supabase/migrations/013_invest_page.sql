-- ============================================================
-- Migration 013: Invest Page Content & Investment Opportunities
-- Tables: invest_page_content, investment_opportunities
-- ============================================================

-- 1. Table: invest_page_content (Sections: 'hero', 'why_invest', 'pathways', 'cta_banner')
CREATE TABLE IF NOT EXISTS invest_page_content (
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

CREATE INDEX IF NOT EXISTS idx_invest_page_content_key 
  ON invest_page_content (section_key);

ALTER TABLE invest_page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_invest_page_content 
  ON invest_page_content 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_invest_page_content 
  ON invest_page_content 
  USING (auth.role() = 'service_role');

-- 2. Table: investment_opportunities (Repeatable active opportunity cards)
CREATE TABLE IF NOT EXISTS investment_opportunities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon                TEXT NOT NULL DEFAULT 'Building2',
  category_tag        TEXT NOT NULL,
  title               TEXT NOT NULL,
  location            TEXT NOT NULL,
  description         TEXT NOT NULL,
  cta_url             TEXT DEFAULT 'modal:inquiry',
  display_order       INTEGER NOT NULL DEFAULT 0,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investment_opportunities_order 
  ON investment_opportunities (display_order ASC);

ALTER TABLE investment_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_investment_opportunities 
  ON investment_opportunities 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_investment_opportunities 
  ON investment_opportunities 
  USING (auth.role() = 'service_role');
