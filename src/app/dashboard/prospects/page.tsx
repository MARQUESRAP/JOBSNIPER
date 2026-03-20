import { createClient } from "@/lib/supabase/server";
import ProspectTable from "@/components/dashboard/ProspectTable";

export default async function ProspectsPage() {
  const supabase = await createClient();

  // Get all job offers with their landing page slugs
  const { data: offers } = await supabase
    .from("job_offers")
    .select("*")
    .order("created_at", { ascending: false });

  // Get landing page slugs
  const { data: pages } = await supabase
    .from("landing_pages")
    .select("job_offer_id, slug");

  const pageMap = new Map(
    (pages || []).map((p) => [p.job_offer_id, p.slug])
  );

  const enrichedOffers = (offers || []).map((o) => ({
    ...o,
    landing_page_slug: pageMap.get(o.id) || undefined,
  }));

  return <ProspectTable offers={enrichedOffers} />;
}
