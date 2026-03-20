"use client";

import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CtaSectionContent } from "@/lib/supabase/types";

interface CtaSectionProps {
  cta: CtaSectionContent;
  onCalendlyClick?: () => void;
}

export default function CtaSection({ cta, onCalendlyClick }: CtaSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const calendlyUrl =
    cta.calendly_url === "{{CALENDLY_URL}}"
      ? process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/raphael-gralt/30min"
      : cta.calendly_url;

  const calendlyWithParams = `${calendlyUrl}?hide_gdpr_banner=1&background_color=0E0E14&text_color=F5F5F7&primary_color=3B82F6`;

  useEffect(() => {
    if (loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [loaded]);

  return (
    <section
      ref={containerRef}
      className="relative px-6 py-24 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-primary) 0%, rgba(59, 130, 246, 0.03) 50%, var(--bg-primary) 100%)",
      }}
      onClick={onCalendlyClick}
    >
      {/* Section divider */}
      <div className="section-divider absolute top-0 left-6 right-6" />

      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Prochaine etape
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[42px]">
            {cta.title}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">{cta.subtitle}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-10">
          <div className="mx-auto max-w-[700px] overflow-hidden rounded-xl">
            {loaded && (
              <div
                className="calendly-inline-widget"
                data-url={calendlyWithParams}
                style={{ minWidth: "320px", height: "630px" }}
              />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3} className="mt-8">
          <div className="flex items-center justify-center gap-2 text-text-tertiary">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{cta.email_fallback_text}</span>
            <a
              href={`mailto:${cta.email_fallback}`}
              className="text-sm text-text-accent underline-offset-4 transition-colors hover:underline hover:text-accent-primary"
            >
              {cta.email_fallback}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
