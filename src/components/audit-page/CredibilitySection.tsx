"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, MapPin, Cpu, Users } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { CredibilitySectionContent } from "@/lib/supabase/types";

interface CredibilitySectionProps {
  credibility: CredibilitySectionContent;
}

const trustIcons = [Shield, MapPin, Cpu, Users];

export default function CredibilitySection({
  credibility,
}: CredibilitySectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 });

  return (
    <section className="bg-bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Preuves
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[42px]">
            {credibility.section_title}
          </h2>
        </ScrollReveal>

        {/* Case study */}
        <ScrollReveal delay={0.2} className="mt-10">
          <div className="card-glow overflow-hidden rounded-xl border border-border-subtle bg-bg-tertiary">
            <div className="border-l-[3px] border-l-accent-primary p-6 md:p-8">
              <p className="text-text-secondary leading-relaxed">
                {credibility.case_study.text}
              </p>
              <div className="mt-5 font-display text-2xl font-bold text-text-accent md:text-3xl">
                {credibility.case_study.metric_highlight}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Trust points */}
        <div ref={gridRef} className="mt-10 grid gap-3 sm:grid-cols-2">
          {credibility.trust_points.map((point, i) => {
            const Icon = trustIcons[i % trustIcons.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.4,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group flex items-start gap-3 rounded-lg p-4 transition-colors duration-300 hover:bg-bg-tertiary/50"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary/5 transition-colors duration-300 group-hover:bg-accent-primary/10">
                  <Icon className="h-4 w-4 text-text-tertiary transition-colors duration-300 group-hover:text-text-accent" />
                </div>
                <span className="text-sm text-text-secondary">{point}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
