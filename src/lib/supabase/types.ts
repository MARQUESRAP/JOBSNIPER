// ============================================
// Database Types — Mirror of Supabase schema
// ============================================

// --- Status types ---
export type JobOfferStatus =
  | "new"
  | "qualified"
  | "enriched"
  | "matched"
  | "page_ready"
  | "ready_to_send"
  | "sent"
  | "opened"
  | "visited"
  | "booked"
  | "converted"
  | "archived"
  | "low_priority";

export type EmailCampaignStatus =
  | "draft"
  | "ready"
  | "sent"
  | "opened"
  | "clicked"
  | "visited"
  | "replied"
  | "booked"
  | "converted"
  | "unsubscribed";

export type EventType =
  | "page_view"
  | "scroll_25"
  | "scroll_50"
  | "scroll_75"
  | "scroll_100"
  | "section_view"
  | "cta_click"
  | "calendly_click"
  | "time_update"
  | "calendly_booking";

// --- Table types ---
export interface Company {
  id: string;
  name: string;
  siret: string | null;
  naf_sector: string | null;
  revenue_bracket: string | null;
  employee_count: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  website_description: string | null;
  linkedin_url: string | null;
  decision_maker_name: string | null;
  decision_maker_email: string | null;
  decision_maker_title: string | null;
  fallback_email: string | null;
  company_score: number;
  enrichment_raw: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface AgentCatalog {
  id: string;
  slug: string;
  name: string;
  replaces_roles: string[];
  tasks_covered: string[];
  stack: string | null;
  monthly_cost_estimate: string | null;
  roi_arguments: string[];
  keywords_matching: string[];
  case_studies: CaseStudy[];
  created_at: string;
  updated_at: string;
}

export interface CaseStudy {
  sector: string;
  size: string;
  result: string;
  detail: string;
}

export interface JobOffer {
  id: string;
  title: string;
  company_name: string;
  company_id: string | null;
  description: string | null;
  location: string | null;
  source_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  contract_type: string | null;
  date_posted: string | null;
  date_scraped: string;
  status: JobOfferStatus;
  automation_score: number | null;
  automation_ratio: number | null;
  tasks_analysis: Record<string, unknown> | null;
  matching_result: Record<string, unknown> | null;
  personalization_hooks: Record<string, unknown> | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  job_offer_id: string | null;
  company_id: string | null;
  page_content: PageContent;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmailCampaign {
  id: string;
  job_offer_id: string | null;
  company_id: string | null;
  landing_page_id: string | null;
  recipient_email: string | null;
  recipient_name: string | null;
  subject_line: string | null;
  email_body: string | null;
  follow_up_1: Record<string, unknown> | null;
  follow_up_2: Record<string, unknown> | null;
  follow_up_3: Record<string, unknown> | null;
  current_step: number;
  status: EmailCampaignStatus;
  sent_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  booked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageAnalytic {
  id: string;
  landing_page_id: string | null;
  event_type: EventType;
  visitor_id: string | null;
  visitor_ip: string | null;
  visitor_city: string | null;
  visitor_device: string | null;
  time_on_page: number | null;
  referrer: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// --- Page Content types (JSONB structure) ---
export interface PageContent {
  meta: PageMeta;
  hero: HeroContent;
  audit_section: AuditSectionContent;
  solution_section: SolutionSectionContent;
  roi_section: RoiSectionContent;
  credibility_section: CredibilitySectionContent;
  cta_section: CtaSectionContent;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
}

export interface AuditSectionContent {
  section_title: string;
  intro: string;
  tasks: TaskContent[];
  summary: string;
}

export interface TaskContent {
  name: string;
  automatable: boolean;
  score: number;
  explanation: string;
  agent_slug: string | null;
}

export interface SolutionSectionContent {
  section_title: string;
  intro: string;
  primary_agent: AgentContent;
  secondary_agent: AgentContent | null;
}

export interface AgentContent {
  name: string;
  description: string;
  key_capabilities: string[];
  setup_time: string;
  integration_note: string;
  added_value?: string;
}

export interface RoiSectionContent {
  section_title: string;
  comparison: RoiComparison;
  saving: RoiSaving;
  bonus_arguments: string[];
  price_display: string;
}

export interface RoiComparison {
  recruitment_label: string;
  recruitment_annual_cost: number;
  recruitment_details: string;
  agent_label: string;
  agent_monthly_cost: string;
  agent_annual_cost: number;
  agent_details: string;
}

export interface RoiSaving {
  annual_amount: number;
  percentage: string;
  display_text: string;
}

export interface CredibilitySectionContent {
  section_title: string;
  case_study: {
    text: string;
    metric_highlight: string;
  };
  trust_points: string[];
}

export interface CtaSectionContent {
  title: string;
  subtitle: string;
  calendly_url: string;
  email_fallback: string;
  email_fallback_text: string;
}

// --- Track event type ---
export interface TrackEvent {
  event_type: EventType;
  landing_page_id: string;
  slug: string;
  visitor_id: string;
  device: "mobile" | "tablet" | "desktop";
  referrer: string | null;
  metadata?: Record<string, unknown>;
}
