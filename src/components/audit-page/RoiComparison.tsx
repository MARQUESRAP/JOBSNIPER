"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import type { RoiComparison as RoiComparisonType } from "@/lib/supabase/types";

interface RoiComparisonProps {
  comparison: RoiComparisonType;
}

function formatCurrencyValue(value: number): string {
  return value.toLocaleString("fr-FR") + "\u00A0\u20AC";
}

export default function RoiComparison({ comparison }: RoiComparisonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2">
      {/* Recruitment column */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="card-glow rounded-xl border border-danger/20 bg-danger-bg p-6 md:p-8"
      >
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-danger">
          {comparison.recruitment_label}
        </span>
        <div className="mt-4 font-mono text-3xl font-bold text-text-primary md:text-4xl">
          <AnimatedCounter
            value={comparison.recruitment_annual_cost}
            formatter={formatCurrencyValue}
          />
          <span className="text-base font-normal text-text-tertiary">/an</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
          {comparison.recruitment_details}
        </p>
      </motion.div>

      {/* Agent column */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="card-glow rounded-xl border border-success/20 bg-success-bg p-6 md:p-8"
      >
        <span className="text-xs font-medium uppercase tracking-[0.15em] text-success">
          {comparison.agent_label}
        </span>
        <div className="mt-4">
          <span className="font-mono text-3xl font-bold text-text-primary md:text-4xl">
            <AnimatedCounter
              value={Number(comparison.agent_monthly_cost)}
              suffix="&euro;"
            />
          </span>
          <span className="text-base font-normal text-text-tertiary">/mois</span>
          <span className="ml-3 font-mono text-lg text-text-secondary">
            soit{" "}
            <AnimatedCounter
              value={comparison.agent_annual_cost}
              formatter={formatCurrencyValue}
            />
            /an
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-tertiary">
          {comparison.agent_details}
        </p>
      </motion.div>
    </div>
  );
}
