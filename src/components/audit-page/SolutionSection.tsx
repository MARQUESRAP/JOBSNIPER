"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import AgentCard from "./AgentCard";
import type { SolutionSectionContent } from "@/lib/supabase/types";

interface SolutionSectionProps {
  solution: SolutionSectionContent;
}

export default function SolutionSection({ solution }: SolutionSectionProps) {
  return (
    <section className="bg-bg-secondary px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Notre solution
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[42px]">
            {solution.section_title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
            {solution.intro}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="mt-10">
          <AgentCard agent={solution.primary_agent} isPrimary />
        </ScrollReveal>

        {solution.secondary_agent && (
          <ScrollReveal delay={0.3} className="mt-4">
            <AgentCard agent={solution.secondary_agent} isPrimary={false} />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
