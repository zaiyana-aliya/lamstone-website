-- ============================================================
-- Migration 002: Content Grids (Admin Editable)
-- Tables: brand_partners, product_categories, lame_products, hero_slides
-- ============================================================

-- 1. brand_partners
CREATE TABLE IF NOT EXISTS brand_partners (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  logo_url       TEXT,
  category_label TEXT NOT NULL,
  partner_type   TEXT NOT NULL CHECK (partner_type IN ('pharmacy', 'cosmetics')),
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brand_partners_type_order 
  ON brand_partners (partner_type, display_order ASC);

-- 2. product_categories
CREATE TABLE IF NOT EXISTS product_categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name     TEXT NOT NULL CHECK (page_name IN ('pharmacy', 'cosmetics')),
  title         TEXT NOT NULL,
  subtitle      TEXT,
  description   TEXT,
  image_url     TEXT,
  features_json JSONB NOT NULL DEFAULT '[]',
  cta_label     TEXT,
  cta_link      TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_categories_page_order 
  ON product_categories (page_name, display_order ASC);

-- 3. lame_products
CREATE TABLE IF NOT EXISTS lame_products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  category_label TEXT NOT NULL,
  descriptor     TEXT,
  description    TEXT NOT NULL,
  image_url      TEXT NOT NULL,
  features_json  JSONB NOT NULL DEFAULT '[]',
  status         TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('coming_soon', 'available')),
  store_url      TEXT,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lame_products_order 
  ON lame_products (display_order ASC);

-- 4. hero_slides
CREATE TABLE IF NOT EXISTS hero_slides (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name          TEXT NOT NULL DEFAULT 'home',
  eyebrow_label      TEXT NOT NULL,
  heading            TEXT NOT NULL,
  subtext            TEXT NOT NULL,
  image_url          TEXT NOT NULL,
  primary_cta_label  TEXT,
  primary_cta_link   TEXT,
  secondary_cta_label TEXT,
  secondary_cta_link TEXT,
  display_order      INTEGER NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hero_slides_page_order 
  ON hero_slides (page_name, display_order ASC);

-- Enable RLS
ALTER TABLE brand_partners    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lame_products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides       ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_brand_partners"    ON brand_partners    FOR SELECT USING (true);
CREATE POLICY "public_read_product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "public_read_lame_products"     ON lame_products     FOR SELECT USING (true);
CREATE POLICY "public_read_hero_slides"       ON hero_slides       FOR SELECT USING (true);

-- Service role policies (for admin mutations)
CREATE POLICY "service_role_brand_partners"    ON brand_partners    USING (auth.role() = 'service_role');
CREATE POLICY "service_role_product_categories" ON product_categories USING (auth.role() = 'service_role');
CREATE POLICY "service_role_lame_products"     ON lame_products     USING (auth.role() = 'service_role');
CREATE POLICY "service_role_hero_slides"       ON hero_slides       USING (auth.role() = 'service_role');
