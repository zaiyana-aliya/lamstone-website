-- ============================================================
-- Migration 005: Core Divisions (Home Page)
-- Table: core_divisions
-- ============================================================

CREATE TABLE IF NOT EXISTS core_divisions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_label   TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  link_url      TEXT NOT NULL,
  cta_label     TEXT NOT NULL DEFAULT 'Learn More',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_core_divisions_active_order 
  ON core_divisions (is_active, display_order ASC);

-- Enable RLS
ALTER TABLE core_divisions ENABLE ROW LEVEL SECURITY;

-- Public read policy: only active core divisions
CREATE POLICY "public_read_active_core_divisions" 
  ON core_divisions 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend & admin
CREATE POLICY "service_role_core_divisions" 
  ON core_divisions 
  USING (auth.role() = 'service_role');
