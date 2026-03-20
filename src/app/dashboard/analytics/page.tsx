import { createClient } from "@/lib/supabase/server";
import StatsCards from "@/components/dashboard/StatsCards";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import type { PageAnalytic } from "@/lib/supabase/types";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Get email campaign metrics
  const { data: campaigns } = await supabase
    .from("email_campaigns")
    .select("status, sent_at, opened_at, clicked_at, booked_at");

  const all = campaigns || [];
  const sent = all.filter(
    (c) => c.status !== "draft" && c.status !== "ready"
  );
  const opened = all.filter((c) =>
    ["opened", "clicked", "visited", "replied", "booked", "converted"].includes(
      c.status
    )
  );
  const clicked = all.filter((c) =>
    ["clicked", "visited", "replied", "booked", "converted"].includes(c.status)
  );
  const visited = all.filter((c) =>
    ["visited", "replied", "booked", "converted"].includes(c.status)
  );
  const booked = all.filter((c) =>
    ["booked", "converted"].includes(c.status)
  );

  // Get page analytics for time on page
  const { data: analytics } = await supabase
    .from("page_analytics")
    .select("*")
    .in("event_type", [
      "page_view",
      "cta_click",
      "calendly_click",
      "calendly_booking",
      "scroll_100",
    ])
    .order("created_at", { ascending: false })
    .limit(50);

  const timeEvents =
    ((await supabase
      .from("page_analytics")
      .select("time_on_page")
      .eq("event_type", "time_update")
      .not("time_on_page", "is", null)
      .limit(100)
      .then((r) => r.data)) || []) as { time_on_page: number }[];

  const avgTime =
    timeEvents.length > 0
      ? Math.round(
          timeEvents.reduce((sum, e) => sum + (e.time_on_page || 0), 0) /
            timeEvents.length
        )
      : 0;

  const stats = [
    {
      label: "Taux ouverture",
      value:
        sent.length > 0
          ? `${Math.round((opened.length / sent.length) * 100)}%`
          : "N/A",
    },
    {
      label: "Taux clic",
      value:
        opened.length > 0
          ? `${Math.round((clicked.length / opened.length) * 100)}%`
          : "N/A",
    },
    {
      label: "Taux visite",
      value:
        clicked.length > 0
          ? `${Math.round((visited.length / clicked.length) * 100)}%`
          : "N/A",
    },
    {
      label: "Taux booking",
      value:
        visited.length > 0
          ? `${Math.round((booked.length / visited.length) * 100)}%`
          : "N/A",
    },
    {
      label: "Temps moyen",
      value: avgTime > 0 ? `${Math.floor(avgTime / 60)}m${avgTime % 60}s` : "N/A",
    },
  ];

  // Placeholder weekly data (in production this would be computed from actual dates)
  const weeklyData = [
    { week: "S1", sent: 0, opened: 0, visited: 0, booked: 0 },
    { week: "S2", sent: 0, opened: 0, visited: 0, booked: 0 },
    { week: "S3", sent: 0, opened: 0, visited: 0, booked: 0 },
    { week: "S4", sent: 0, opened: 0, visited: 0, booked: 0 },
  ];

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsCharts data={weeklyData} />
        </div>
        <ActivityFeed initialEvents={(analytics || []) as PageAnalytic[]} />
      </div>
    </div>
  );
}
