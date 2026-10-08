-- ============================================================
-- Migration 004: Home Division Cards
-- Table: division_cards
-- ============================================================

CREATE TABLE IF NOT EXISTS division_cards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  subtitle      TEXT NOT NULL,
  icon          TEXT NOT NULL,
  link_url      TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_division_cards_active_order 
  ON division_cards (is_active, display_order ASC);

-- Enable RLS
ALTER TABLE division_cards ENABLE ROW LEVEL SECURITY;

-- Public read policy: only active division cards
CREATE POLICY "public_read_active_division_cards" 
  ON division_cards 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend & admin
CREATE POLICY "service_role_division_cards" 
  ON division_cards 
  USING (auth.role() = 'service_role');
