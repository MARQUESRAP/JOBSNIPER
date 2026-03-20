import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuditPageClient from "@/components/audit-page/AuditPageClient";
import type { PageContent } from "@/lib/supabase/types";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("landing_pages")
    .select("page_content")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) {
    return { title: "Page introuvable | Gralt" };
  }

  const content = data.page_content as PageContent;

  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: `https://audit.gralt.fr/${slug}`,
    },
    robots: "noindex, nofollow",
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("landing_pages")
    .select("id, slug, page_content")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) {
    notFound();
  }

  const content = data.page_content as PageContent;

  return (
    <div className="relative">
      <AuditPageClient
        content={content}
        landingPageId={data.id}
        slug={data.slug}
      />
    </div>
  );
}
