import type { JobOfferStatus, EmailCampaignStatus } from "@/lib/supabase/types";

export const PIPELINE_STAGES: JobOfferStatus[] = [
  "new",
  "qualified",
  "enriched",
  "matched",
  "page_ready",
  "ready_to_send",
  "sent",
  "opened",
  "visited",
  "booked",
  "converted",
];

export const STATUS_LABELS: Record<JobOfferStatus, string> = {
  new: "Nouveau",
  qualified: "Qualifié",
  enriched: "Enrichi",
  matched: "Matché",
  page_ready: "Page prête",
  ready_to_send: "Prêt à envoyer",
  sent: "Envoyé",
  opened: "Ouvert",
  visited: "Visité",
  booked: "Booké",
  converted: "Converti",
  archived: "Archivé",
  low_priority: "Basse priorité",
};

export const STATUS_COLORS: Record<JobOfferStatus, string> = {
  new: "bg-text-tertiary",
  qualified: "bg-accent-primary",
  enriched: "bg-accent-primary",
  matched: "bg-accent-primary",
  page_ready: "bg-warning",
  ready_to_send: "bg-warning",
  sent: "bg-warning",
  opened: "bg-warning",
  visited: "bg-success",
  booked: "bg-success",
  converted: "bg-success",
  archived: "bg-danger",
  low_priority: "bg-text-tertiary",
};

export const EMAIL_STATUS_LABELS: Record<EmailCampaignStatus, string> = {
  draft: "Brouillon",
  ready: "Prêt",
  sent: "Envoyé",
  opened: "Ouvert",
  clicked: "Cliqué",
  visited: "Visité",
  replied: "Répondu",
  booked: "Booké",
  converted: "Converti",
  unsubscribed: "Désinscrit",
};
