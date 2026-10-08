-- ============================================================
-- Lamstone HealthCare — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. contact_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  subject       TEXT NOT NULL,
  message       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. newsletter_subscribers
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL UNIQUE,
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================
-- 3. investment_requests
-- ============================================================
CREATE TABLE IF NOT EXISTS investment_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT NOT NULL,
  request_type     TEXT NOT NULL CHECK (request_type IN ('deck', 'memorandum', 'opportunity_inquiry')),
  opportunity_name TEXT,
  message          TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. lame_launch_notify
-- ============================================================
CREATE TABLE IF NOT EXISTS lame_launch_notify (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT NOT NULL,
  product_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, product_name)
);

-- ============================================================
-- 5. distribution_inquiries
-- ============================================================
CREATE TABLE IF NOT EXISTS distribution_inquiries (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  company    TEXT NOT NULL,
  category   TEXT NOT NULL CHECK (category IN ('skincare', 'personal_care', 'healthcare_cosmetics')),
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. careers_applications
-- ============================================================
CREATE TABLE IF NOT EXISTS careers_applications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  position     TEXT NOT NULL,
  resume_url   TEXT,
  cover_letter TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'shortlisted', 'rejected')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. partnership_inquiries
-- ============================================================
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT NOT NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('pharmacy_partner', 'general')),
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 8. pharmacy_locations
-- ============================================================
CREATE TABLE IF NOT EXISTS pharmacy_locations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  area          TEXT NOT NULL,
  district      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open_dispensing' CHECK (status IN ('open_dispensing', 'closed')),
  phone         TEXT,
  map_url       TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_pharmacy_locations_order ON pharmacy_locations (display_order ASC);

-- ============================================================
-- 9. blog_posts
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  content         JSONB,                   -- Tiptap JSON format
  excerpt         TEXT,
  cover_image_url TEXT,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 10. page_content
-- ============================================================
CREATE TABLE IF NOT EXISTS page_content (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name    TEXT NOT NULL,
  section_key  TEXT NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (page_name, section_key)
);

CREATE TRIGGER page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 11. media_assets
-- ============================================================
CREATE TABLE IF NOT EXISTS media_assets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url         TEXT NOT NULL,
  filename    TEXT NOT NULL,
  mime_type   TEXT,
  size_bytes  INTEGER,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 12. admin_users
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'editor')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Public: read-only on pharmacy_locations, blog_posts (published), page_content
-- All mutations: service_role only
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE contact_submissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lame_launch_notify      ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_inquiries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers_applications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_inquiries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_locations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content            ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets            ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users             ENABLE ROW LEVEL SECURITY;

-- Submission tables: no public access (API routes use service_role)
CREATE POLICY "service_role_only" ON contact_submissions    USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON newsletter_subscribers USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON investment_requests    USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON lame_launch_notify     USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON distribution_inquiries USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON careers_applications   USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON partnership_inquiries  USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON media_assets           USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON admin_users            USING (auth.role() = 'service_role');
CREATE POLICY "service_role_only" ON page_content           USING (auth.role() = 'service_role');

-- Public read: pharmacy_locations (open dispensing)
CREATE POLICY "public_read_open_pharmacies" ON pharmacy_locations
  FOR SELECT USING (true);

-- Public read: blog_posts (published only)
CREATE POLICY "public_read_published_posts" ON blog_posts
  FOR SELECT USING (published = TRUE);

-- Supabase Storage buckets (create these in the Dashboard under Storage)
-- Bucket: "resumes"    — private, max 5MB, allow: application/pdf, application/msword, etc.
-- Bucket: "media"      — public, max 10MB, allow: image/*
-- Both buckets are created manually in the Supabase Dashboard → Storage → New Bucket
