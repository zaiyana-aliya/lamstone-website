-- ============================================================
-- Migration 008: About Page Lists & Campus Content
-- Tables: about_values, about_milestones
-- Content: Campus row in about_page_content
-- ============================================================

-- 1. Table: about_values
CREATE TABLE IF NOT EXISTS about_values (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon          TEXT NOT NULL DEFAULT 'ShieldCheck',
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_values_order 
  ON about_values (display_order ASC);

ALTER TABLE about_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_about_values 
  ON about_values 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_about_values 
  ON about_values 
  USING (auth.role() = 'service_role');


-- 2. Table: about_milestones
CREATE TABLE IF NOT EXISTS about_milestones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year            TEXT NOT NULL,
  milestone_label TEXT NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_about_milestones_order 
  ON about_milestones (display_order ASC);

ALTER TABLE about_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_active_about_milestones 
  ON about_milestones 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY service_role_about_milestones 
  ON about_milestones 
  USING (auth.role() = 'service_role');


-- 3. Seed Campus Section in about_page_content (if not present)
INSERT INTO about_page_content (
  section_key,
  eyebrow_label,
  heading,
  description,
  image_url,
  cta_label,
  cta_url,
  extra_data,
  is_active
)
VALUES (
  'campus',
  'Our Campus',
  'A Modern Infrastructure',
  'Our state-of-the-art facilities are designed to support innovation, research and world-class manufacturing. With cutting-edge technology and strict quality standards, we ensure that every product meets the highest level of excellence.',
  '/images/about/corporate-head-office.jpg',
  'Our Manufacturing Units',
  '/pharmacy-chain',
  '{"badge_subtitle": "Pharma | Cosmetics | Personal Care", "image_caption": "Corporate Head Office — Bio 360, Kerala Life Sciences Industrial Park"}'::jsonb,
  true
)
ON CONFLICT (section_key) DO NOTHING;
