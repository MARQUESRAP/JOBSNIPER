import { createClient } from "@/lib/supabase/server";
import StatsCards from "@/components/dashboard/StatsCards";
import PipelineView from "@/components/dashboard/PipelineView";
import type { JobOffer } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get all job offers
  const { data: offers } = await supabase
    .from("job_offers")
    .select("*")
    .order("created_at", { ascending: false });

  const allOffers = (offers || []) as JobOffer[];

  // Get this week's start
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const thisWeek = allOffers.filter(
    (o) => new Date(o.created_at) >= weekStart
  );

  // Get email campaign stats
  const { data: campaigns } = await supabase
    .from("email_campaigns")
    .select("status");

  const allCampaigns = campaigns || [];

  const stats = [
    { label: "Offres (semaine)", value: thisWeek.length },
    {
      label: "Qualifi\u00e9es",
      value: allOffers.filter(
        (o) => !["new", "archived", "low_priority"].includes(o.status)
      ).length,
    },
    {
      label: "Pages g\u00e9n\u00e9r\u00e9es",
      value: allOffers.filter((o) =>
        [
          "page_ready",
          "ready_to_send",
          "sent",
          "opened",
          "visited",
          "booked",
          "converted",
        ].includes(o.status)
      ).length,
    },
    {
      label: "Emails envoy\u00e9s",
      value: allCampaigns.filter((c) => c.status !== "draft" && c.status !== "ready")
        .length,
    },
    {
      label: "Taux ouverture",
      value: (() => {
        const sent = allCampaigns.filter(
          (c) => c.status !== "draft" && c.status !== "ready"
        ).length;
        const opened = allCampaigns.filter((c) =>
          ["opened", "clicked", "visited", "replied", "booked", "converted"].includes(
            c.status
          )
        ).length;
        return sent > 0 ? `${Math.round((opened / sent) * 100)}%` : "N/A";
      })(),
    },
    {
      label: "Pages visit\u00e9es",
      value: allOffers.filter((o) =>
        ["visited", "booked", "converted"].includes(o.status)
      ).length,
    },
    {
      label: "Calls book\u00e9s",
      value: allOffers.filter((o) =>
        ["booked", "converted"].includes(o.status)
      ).length,
    },
  ];

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <PipelineView offers={allOffers} />
    </div>
  );
}
