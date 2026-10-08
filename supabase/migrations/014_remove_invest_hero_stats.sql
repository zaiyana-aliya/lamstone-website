-- ============================================================
-- Migration 014: Remove Invest Hero Stats from invest_page_content
-- Removes stat_target_pharmacies, stat_districts, stat_brand_partners,
-- and stat_authentic_badge keys from hero section extra_data
-- ============================================================

UPDATE invest_page_content
SET extra_data = (extra_data - 'stat_target_pharmacies' - 'stat_districts' - 'stat_brand_partners' - 'stat_authentic_badge'),
    updated_at = NOW()
WHERE section_key = 'hero';
