-- ============================================
-- JOBSNIPER — Initial Schema Migration
-- ============================================

-- ============================================
-- TABLE: companies
-- ============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  siret TEXT,
  naf_sector TEXT,
  revenue_bracket TEXT,
  employee_count TEXT,
  city TEXT,
  region TEXT,
  website TEXT,
  website_description TEXT,
  linkedin_url TEXT,
  decision_maker_name TEXT,
  decision_maker_email TEXT,
  decision_maker_title TEXT,
  fallback_email TEXT,
  company_score INTEGER DEFAULT 0,
  enrichment_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: agents_catalog
-- ============================================
CREATE TABLE agents_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  replaces_roles JSONB NOT NULL DEFAULT '[]',
  tasks_covered JSONB NOT NULL DEFAULT '[]',
  stack TEXT,
  monthly_cost_estimate TEXT,
  roi_arguments JSONB NOT NULL DEFAULT '[]',
  keywords_matching JSONB NOT NULL DEFAULT '[]',
  case_studies JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: job_offers
-- ============================================
CREATE TABLE job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  description TEXT,
  location TEXT,
  source_url TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  contract_type TEXT,
  date_posted TIMESTAMPTZ,
  date_scraped TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN (
      'new', 'qualified', 'enriched', 'matched', 'page_ready',
      'ready_to_send', 'sent', 'opened', 'visited', 'booked',
      'converted', 'archived', 'low_priority'
    )),
  automation_score INTEGER,
  automation_ratio DECIMAL(5,2),
  tasks_analysis JSONB,
  matching_result JSONB,
  personalization_hooks JSONB,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: landing_pages
-- ============================================
CREATE TABLE landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  page_content JSONB NOT NULL DEFAULT '{}',
  url TEXT GENERATED ALWAYS AS ('https://audit.gralt.fr/' || slug) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: email_campaigns
-- ============================================
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE SET NULL,
  recipient_email TEXT,
  recipient_name TEXT,
  subject_line TEXT,
  email_body TEXT,
  follow_up_1 JSONB,
  follow_up_2 JSONB,
  follow_up_3 JSONB,
  current_step INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN (
      'draft', 'ready', 'sent', 'opened', 'clicked',
      'visited', 'replied', 'booked', 'converted', 'unsubscribed'
    )),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABLE: page_analytics
-- ============================================
CREATE TABLE page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL
    CHECK (event_type IN (
      'page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100',
      'section_view', 'cta_click', 'calendly_click', 'time_update', 'calendly_booking'
    )),
  visitor_id TEXT,
  visitor_ip TEXT,
  visitor_city TEXT,
  visitor_device TEXT,
  time_on_page INTEGER,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_job_offers_status ON job_offers(status);
CREATE INDEX idx_page_analytics_landing_page_created ON page_analytics(landing_page_id, created_at);
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Public read access for active landing pages (anon)
CREATE POLICY "landing_pages_public_read" ON landing_pages
  FOR SELECT USING (is_active = true);

-- Public read access for agents catalog (needed by landing pages)
CREATE POLICY "agents_catalog_public_read" ON agents_catalog
  FOR SELECT USING (true);

-- Public insert for page analytics (tracking from landing pages)
CREATE POLICY "page_analytics_public_insert" ON page_analytics
  FOR INSERT WITH CHECK (true);

-- Public read for page analytics (needed for dashboard queries via service role)
CREATE POLICY "page_analytics_public_read" ON page_analytics
  FOR SELECT USING (true);

-- Authenticated (admin) full access on all tables
CREATE POLICY "companies_admin_all" ON companies
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "agents_catalog_admin_all" ON agents_catalog
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "job_offers_admin_all" ON job_offers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "landing_pages_admin_all" ON landing_pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "email_campaigns_admin_all" ON email_campaigns
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "page_analytics_admin_all" ON page_analytics
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER agents_catalog_updated_at
  BEFORE UPDATE ON agents_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER job_offers_updated_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER landing_pages_updated_at
  BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
