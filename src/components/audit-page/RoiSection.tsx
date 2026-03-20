"use client";

import { Zap, RefreshCw, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import RoiComparison from "./RoiComparison";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import type { RoiSectionContent } from "@/lib/supabase/types";

interface RoiSectionProps {
  roi: RoiSectionContent;
}

const bonusIcons = [Zap, RefreshCw, TrendingUp];

export default function RoiSection({ roi }: RoiSectionProps) {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section divider */}
        <div className="section-divider mb-20" />

        <ScrollReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Retour sur investissement
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[42px]">
            {roi.section_title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-10">
          <RoiComparison comparison={roi.comparison} />
        </ScrollReveal>

        {/* Saving highlight */}
        <ScrollReveal delay={0.4} className="mt-10 text-center">
          <div className="inline-block rounded-2xl border border-border-accent/30 bg-accent-primary/5 px-10 py-8 backdrop-blur-sm">
            <div className="font-mono text-3xl font-bold text-text-accent md:text-4xl lg:text-5xl">
              {roi.saving.display_text}
            </div>
          </div>
        </ScrollReveal>

        {/* Bonus arguments */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {roi.bonus_arguments.map((arg, i) => {
            const Icon = bonusIcons[i % bonusIcons.length];
            return (
              <ScrollReveal key={i} delay={0.5 + i * 0.1}>
                <div className="card-glow group flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-secondary p-5 transition-colors duration-300 hover:border-border-default">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10 transition-colors duration-300 group-hover:bg-accent-primary/20">
                    <Icon className="h-5 w-5 text-text-accent" />
                  </div>
                  <span className="text-sm leading-relaxed text-text-secondary">
                    {arg}
                  </span>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Price line */}
        <ScrollReveal delay={0.7} className="mt-10 text-center">
          <p className="text-text-secondary">{roi.price_display}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
