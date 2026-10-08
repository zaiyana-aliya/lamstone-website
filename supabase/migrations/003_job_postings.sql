-- ============================================================
-- Migration 003: Job Postings
-- Table: job_postings
-- ============================================================

CREATE TABLE IF NOT EXISTS job_postings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  department      TEXT NOT NULL,
  location        TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full-time', 'part-time', 'internship', 'contract')),
  description     TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  display_order   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_postings_active_order 
  ON job_postings (is_active, display_order ASC);

-- Enable RLS
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Public read policy: only active job postings
CREATE POLICY "public_read_active_job_postings" 
  ON job_postings 
  FOR SELECT 
  USING (is_active = true);

-- Service role policy: full CRUD access for backend & admin
CREATE POLICY "service_role_job_postings" 
  ON job_postings 
  USING (auth.role() = 'service_role');
