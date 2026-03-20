-- ══════════════════════════════════════════════════════════════
-- JOBSNIPER — Migration Supabase Complète
-- À exécuter dans l'éditeur SQL de Supabase (supabase.com > SQL Editor)
-- ══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────┐
-- │  1. TABLE COMPANIES                          │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  siret TEXT,
  sector_naf TEXT,
  sector_label TEXT,
  revenue_bracket TEXT,
  employee_count INTEGER,
  city TEXT,
  region TEXT,
  website TEXT,
  website_description TEXT,
  linkedin_url TEXT,
  decision_maker_name TEXT,
  decision_maker_email TEXT,
  decision_maker_title TEXT,
  decision_maker_firstname TEXT,
  fallback_email TEXT,
  company_score INTEGER CHECK (company_score BETWEEN 1 AND 15),
  enrichment_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche par nom
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);


-- ┌─────────────────────────────────────────────┐
-- │  2. TABLE AGENTS_CATALOG                     │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS agents_catalog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  replaces_roles JSONB,
  tasks_covered JSONB,
  keywords_matching JSONB,
  stack TEXT,
  monthly_cost_min INTEGER,
  monthly_cost_max INTEGER,
  setup_time TEXT,
  roi_arguments JSONB,
  case_studies JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ┌─────────────────────────────────────────────┐
-- │  3. TABLE JOB_OFFERS                         │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS job_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  source_url TEXT,
  source_platform TEXT DEFAULT 'google_jobs',
  contract_type TEXT DEFAULT 'CDI',
  salary_min INTEGER,
  salary_max INTEGER,
  date_posted TEXT,
  date_scraped TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'qualified', 'enriched', 'matched', 
    'page_ready', 'ready_to_send', 'sent', 
    'opened', 'visited', 'booked', 'converted', 
    'archived', 'low_priority'
  )),
  automation_score INTEGER CHECK (automation_score BETWEEN 1 AND 10),
  automation_ratio DECIMAL,
  tasks_analysis JSONB,
  matching_result JSONB,
  personalization_hooks JSONB,
  rejection_reason TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  landing_page_id UUID,  -- FK ajoutée après création de landing_pages
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour filtre par statut (requête la plus fréquente)
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON job_offers (status);

-- Index pour déduplication (recherche par company + title)
CREATE INDEX IF NOT EXISTS idx_job_offers_dedup ON job_offers (company_name, title);

-- Index pour date de scraping (filtrage temporel)
CREATE INDEX IF NOT EXISTS idx_job_offers_scraped ON job_offers (date_scraped DESC);


-- ┌─────────────────────────────────────────────┐
-- │  4. TABLE LANDING_PAGES                      │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  page_content JSONB NOT NULL,
  url TEXT GENERATED ALWAYS AS ('https://audit.gralt.fr/' || slug) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour lookup par slug (requête à chaque visite de page)
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages (slug);

-- Ajouter la FK sur job_offers maintenant que landing_pages existe
ALTER TABLE job_offers 
  ADD CONSTRAINT fk_job_offers_landing_page 
  FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE SET NULL;


-- ┌─────────────────────────────────────────────┐
-- │  5. TABLE EMAIL_CAMPAIGNS                    │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_offer_id UUID REFERENCES job_offers(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  recipient_firstname TEXT,
  subject_line TEXT NOT NULL,
  email_body TEXT NOT NULL,
  follow_up_1 JSONB,
  follow_up_2 JSONB,
  follow_up_3 JSONB,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'ready', 'sent', 'opened', 'clicked',
    'visited', 'replied', 'booked', 'converted', 'unsubscribed'
  )),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  booked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour séquence de follow-up (requête quotidienne)
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns (status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_sent ON email_campaigns (sent_at DESC);


-- ┌─────────────────────────────────────────────┐
-- │  6. TABLE PAGE_ANALYTICS                     │
-- └─────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100',
    'section_view', 'cta_click', 'calendly_click', 'calendly_booking', 'time_update'
  )),
  visitor_id TEXT,
  visitor_ip TEXT,
  visitor_city TEXT,
  visitor_device TEXT,
  time_on_page INTEGER,
  referrer TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index composite pour analytics (requêtes dashboard)
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_date 
  ON page_analytics (landing_page_id, created_at DESC);

-- Index pour alertes temps réel
CREATE INDEX IF NOT EXISTS idx_page_analytics_event 
  ON page_analytics (event_type, created_at DESC);


-- ┌─────────────────────────────────────────────┐
-- │  7. FONCTION updated_at AUTOMATIQUE          │
-- └─────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur companies
CREATE TRIGGER set_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger sur job_offers
CREATE TRIGGER set_job_offers_updated_at
  BEFORE UPDATE ON job_offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ┌─────────────────────────────────────────────┐
-- │  8. ROW LEVEL SECURITY (RLS)                 │
-- └─────────────────────────────────────────────┘

-- Activer RLS sur toutes les tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Landing pages : lecture publique (les prospects doivent voir les pages)
CREATE POLICY "Landing pages lisibles par tous"
  ON landing_pages FOR SELECT
  USING (is_active = true);

-- Agents catalog : lecture publique (affiché sur les pages)
CREATE POLICY "Agents catalog lisible par tous"
  ON agents_catalog FOR SELECT
  USING (true);

-- Page analytics : insertion publique (le tracking JS des visiteurs)
CREATE POLICY "Analytics insertion publique"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

-- Toutes les tables : accès complet pour le service role (n8n / backend)
-- Le service role bypass RLS par défaut, pas besoin de policy

-- Pour le dashboard (auth user = admin) : accès complet
CREATE POLICY "Admin accès complet companies"
  ON companies FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin accès complet job_offers"
  ON job_offers FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin accès complet landing_pages"
  ON landing_pages FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin accès complet email_campaigns"
  ON email_campaigns FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin accès complet page_analytics"
  ON page_analytics FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin accès complet agents_catalog"
  ON agents_catalog FOR ALL
  USING (auth.role() = 'authenticated');


-- ┌─────────────────────────────────────────────┐
-- │  9. SEED — CATALOGUE DES 5 AGENTS            │
-- └─────────────────────────────────────────────┘

INSERT INTO agents_catalog (slug, name, replaces_roles, tasks_covered, keywords_matching, stack, monthly_cost_min, monthly_cost_max, setup_time, roi_arguments, case_studies) VALUES

-- Agent 1 : Prospecteur Outbound
(
  'prospecteur_outbound',
  'Agent Prospecteur Outbound',
  '["SDR", "BDR", "Téléprospecteur", "Chargé de prospection", "Développeur commercial"]'::jsonb,
  '[
    "Scraping et constitution de listes de prospects qualifiés (500+ leads/jour)",
    "Enrichissement automatique (email vérifié, téléphone, LinkedIn, SIRET, CA, effectif)",
    "Séquences email multicanales personnalisées par IA (chaque email est unique)",
    "Scoring et priorisation des leads selon signaux d engagement",
    "Mise à jour CRM automatique en temps réel",
    "A/B testing automatique des objets et contenus",
    "Reporting quotidien et hebdomadaire des performances"
  ]'::jsonb,
  '["prospection", "fichier", "leads", "enrichissement", "emailing", "séquence", "scoring", "pipeline", "CRM", "outbound"]'::jsonb,
  'n8n + Claude API + Hunter.io + Apollo.io + Apify + Dropcontact + CRM',
  600, 1000,
  '1 à 2 semaines',
  '[
    "Un SDR traite ~50 leads/jour. L agent en traite 500+, 7j/7",
    "Personnalisation à l échelle : chaque email est unique",
    "Aucun lead oublié : suivi automatique de chaque interaction",
    "Coût 4x inférieur au salaire d un SDR junior"
  ]'::jsonb,
  '[{"sector": "SaaS B2B", "size": "30 employés", "result": "3x plus de leads qualifiés en 2 mois", "detail": "Automatisation complète de la prospection outbound, de la constitution de fichier à la prise de RDV"}]'::jsonb
),

-- Agent 2 : Qualificateur Inbound
(
  'qualificateur_inbound',
  'Agent Qualificateur Inbound',
  '["Commercial sédentaire", "Assistant commercial", "Chargé de clientèle", "Gestionnaire leads"]'::jsonb,
  '[
    "Réponse automatique personnalisée aux leads entrants en < 2 minutes",
    "Qualification structurée via conversation IA (BANT/MEDDIC)",
    "Scoring automatique des leads selon potentiel détecté",
    "Prise de RDV directe dans l agenda des commerciaux",
    "Routing intelligent vers le bon interlocuteur",
    "Synchronisation CRM en temps réel",
    "Détection et alerte sur les leads à fort potentiel"
  ]'::jsonb,
  '["qualification", "inbound", "leads entrants", "formulaire", "chat", "réponse", "rendez-vous", "agenda", "scoring", "CRM"]'::jsonb,
  'n8n + Claude API + Calendly/Cal.com + CRM + Webhooks',
  600, 900,
  '1 à 2 semaines',
  '[
    "Temps de réponse moyen en France : 42h. L agent répond en < 2 min",
    "Taux de conversion x3 quand réponse < 5 min",
    "Qualification 24/7 sans interruption",
    "Aucun lead entrant perdu ou oublié"
  ]'::jsonb,
  '[{"sector": "Services B2B", "size": "45 employés", "result": "Taux de conversion des leads entrants doublé", "detail": "Réponse instantanée + qualification automatique + prise de RDV directe"}]'::jsonb
),

-- Agent 3 : Relanceur & Closer Support
(
  'relanceur_closer_support',
  'Agent Relanceur & Closer Support',
  '["Chargé de relance", "Assistant commercial (suivi)", "Gestionnaire de comptes", "Chargé de recouvrement commercial"]'::jsonb,
  '[
    "Follow-ups automatiques post-devis (J+2, J+5, J+10, J+20)",
    "Nurturing des leads tièdes avec contenu à valeur",
    "Détection de signaux de réengagement (ouverture email, visite site)",
    "Alertes temps réel quand un lead chaud se réactive",
    "Relance automatique des clients dormants",
    "Relance des factures impayées (séquence progressive)",
    "Reporting pipeline complet (taux conversion, délai moyen)"
  ]'::jsonb,
  '["relance", "follow-up", "suivi", "devis", "nurturing", "pipeline", "reporting", "recouvrement", "réactivation"]'::jsonb,
  'n8n + Claude API + CRM + Brevo/Resend + tracking web',
  500, 800,
  '1 semaine',
  '[
    "80% des ventes nécessitent 5+ relances",
    "44% des commerciaux abandonnent après 1 seul follow-up",
    "L agent ne lâche jamais et relance au moment optimal",
    "Visibilité complète sur le pipeline en temps réel"
  ]'::jsonb,
  '[{"sector": "Services professionnels", "size": "25 employés", "result": "Taux de conversion devis augmenté de 35%", "detail": "Séquences de relance intelligentes avec détection de signaux de réengagement"}]'::jsonb
),

-- Agent 4 : Veilleur Commercial
(
  'veilleur_commercial',
  'Agent Veilleur Commercial',
  '["Chargé de veille", "Analyste marché junior", "Assistant intelligence commerciale"]'::jsonb,
  '[
    "Monitoring continu des signaux d achat (levées de fonds, recrutements, déménagements)",
    "Alertes sur appels d offres pertinents",
    "Veille concurrentielle automatisée (prix, offres, actualités)",
    "Scraping d actualités sectorielles et résumés IA",
    "Rapports de marché hebdomadaires synthétisés",
    "Détection d opportunités cross-sell et upsell"
  ]'::jsonb,
  '["veille", "marché", "concurrence", "signaux", "appels d offres", "reporting", "intelligence commerciale", "analyse"]'::jsonb,
  'n8n + Claude API + Apify + Google Alerts + flux RSS',
  500, 800,
  '1 à 2 semaines',
  '[
    "Un analyste passe 15h/semaine en veille manuelle",
    "L agent couvre 10x plus de sources en continu",
    "Détection proactive d opportunités invisibles autrement",
    "Rapports synthétisés et actionnables chaque semaine"
  ]'::jsonb,
  '[{"sector": "Distribution B2B", "size": "60 employés", "result": "Détection de 12 opportunités manquées en 3 mois", "detail": "Monitoring automatique des signaux d achat et alertes en temps réel"}]'::jsonb
),

-- Agent 5 : Gestionnaire ADV
(
  'gestionnaire_adv',
  'Agent Gestionnaire ADV',
  '["Assistant ADV", "Gestionnaire des ventes", "Coordinateur des ventes", "Assistant administration des ventes"]'::jsonb,
  '[
    "Création automatique de devis à partir de templates et données CRM",
    "Transformation devis → bon de commande → facture",
    "Suivi des commandes en temps réel avec alertes retard",
    "Mise à jour automatique des statuts dans l ERP/CRM",
    "Gestion des réclamations niveau 1 (accusé réception, routing)",
    "Reporting des ventes automatisé (CA, marges, top clients)",
    "Archivage et classement automatique des documents commerciaux"
  ]'::jsonb,
  '["ADV", "administration des ventes", "devis", "commandes", "facturation", "bon de commande", "suivi", "ERP", "réclamation", "reporting ventes"]'::jsonb,
  'n8n + Claude API + ERP/CRM + Pennylane/Sellsy + API facturation',
  600, 1000,
  '2 à 3 semaines',
  '[
    "Un assistant ADV passe 70% de son temps sur des tâches de saisie et suivi",
    "0 erreur de saisie contre 2-5% en moyenne humaine",
    "Cycle order-to-cash réduit de 40%",
    "Disponible 24/7 pour les commandes et réclamations"
  ]'::jsonb,
  '[{"sector": "Négoce B2B", "size": "35 employés", "result": "Temps de traitement des commandes divisé par 3", "detail": "Automatisation complète du cycle devis-commande-facture avec synchronisation ERP"}]'::jsonb
);


-- ┌─────────────────────────────────────────────┐
-- │  10. VUES UTILES POUR LE DASHBOARD           │
-- └─────────────────────────────────────────────┘

-- Vue pipeline : compteurs par statut
CREATE OR REPLACE VIEW pipeline_stats AS
SELECT 
  status,
  COUNT(*) as count,
  AVG(automation_score) as avg_score
FROM job_offers
WHERE date_scraped > NOW() - INTERVAL '30 days'
GROUP BY status
ORDER BY 
  CASE status
    WHEN 'new' THEN 1
    WHEN 'qualified' THEN 2
    WHEN 'enriched' THEN 3
    WHEN 'matched' THEN 4
    WHEN 'page_ready' THEN 5
    WHEN 'ready_to_send' THEN 6
    WHEN 'sent' THEN 7
    WHEN 'opened' THEN 8
    WHEN 'visited' THEN 9
    WHEN 'booked' THEN 10
    WHEN 'converted' THEN 11
    ELSE 99
  END;

-- Vue métriques email
CREATE OR REPLACE VIEW email_metrics AS
SELECT
  COUNT(*) FILTER (WHERE status != 'draft') as total_sent,
  COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as total_opened,
  COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as total_clicked,
  COUNT(*) FILTER (WHERE replied_at IS NOT NULL) as total_replied,
  COUNT(*) FILTER (WHERE booked_at IS NOT NULL) as total_booked,
  COUNT(*) FILTER (WHERE status = 'converted') as total_converted,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE opened_at IS NOT NULL) / 
    NULLIF(COUNT(*) FILTER (WHERE status != 'draft'), 0), 1
  ) as open_rate,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) / 
    NULLIF(COUNT(*) FILTER (WHERE opened_at IS NOT NULL), 0), 1
  ) as click_rate,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE booked_at IS NOT NULL) / 
    NULLIF(COUNT(*) FILTER (WHERE clicked_at IS NOT NULL), 0), 1
  ) as booking_rate
FROM email_campaigns;

-- Vue activité récente (pour le feed du dashboard)
CREATE OR REPLACE VIEW recent_activity AS
SELECT 
  pa.event_type,
  pa.created_at,
  pa.time_on_page,
  pa.visitor_device,
  lp.slug as page_slug,
  c.name as company_name,
  jo.title as job_title
FROM page_analytics pa
JOIN landing_pages lp ON pa.landing_page_id = lp.id
LEFT JOIN companies c ON lp.company_id = c.id
LEFT JOIN job_offers jo ON lp.job_offer_id = jo.id
WHERE pa.event_type IN ('page_view', 'cta_click', 'calendly_click', 'calendly_booking')
ORDER BY pa.created_at DESC
LIMIT 50;


-- ══════════════════════════════════════════════════════════════
-- FIN DE LA MIGRATION
-- 
-- Tables créées : 6
-- Index créés : 8  
-- Vues créées : 3
-- Agents seedés : 5
-- Triggers : 2
-- Policies RLS : 8
-- ══════════════════════════════════════════════════════════════
