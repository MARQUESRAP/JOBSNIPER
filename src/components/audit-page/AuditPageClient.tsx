"use client";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import AuditSection from "./AuditSection";
import SolutionSection from "./SolutionSection";
import RoiSection from "./RoiSection";
import CredibilitySection from "./CredibilitySection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import { useTracker } from "@/hooks/useTracker";
import type { PageContent } from "@/lib/supabase/types";

interface AuditPageClientProps {
  content: PageContent;
  landingPageId: string;
  slug: string;
}

export default function AuditPageClient({
  content,
  landingPageId,
  slug,
}: AuditPageClientProps) {
  const { trackCta } = useTracker(landingPageId, slug);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection hero={content.hero} />
        <AuditSection audit={content.audit_section} />
        <SolutionSection solution={content.solution_section} />
        <RoiSection roi={content.roi_section} />
        <CredibilitySection credibility={content.credibility_section} />
        <CtaSection
          cta={content.cta_section}
          onCalendlyClick={() => trackCta("calendly_click")}
        />
      </main>
      <Footer />

      {/* Scroll tracking sentinels */}
      <div id="scroll-25" className="absolute" style={{ top: "25%" }} />
      <div id="scroll-50" className="absolute" style={{ top: "50%" }} />
      <div id="scroll-75" className="absolute" style={{ top: "75%" }} />
      <div id="scroll-100" className="absolute" style={{ bottom: 0 }} />
    </>
  );
}
