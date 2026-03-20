"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TaskCard from "./TaskCard";
import ProgressBar from "./ProgressBar";
import type { AuditSectionContent } from "@/lib/supabase/types";

interface AuditSectionProps {
  audit: AuditSectionContent;
}

export default function AuditSection({ audit }: AuditSectionProps) {
  const automatableTasks = audit.tasks.filter((t) => t.automatable).length;
  const totalTasks = audit.tasks.length;
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section divider */}
        <div className="section-divider mb-20" />

        <ScrollReveal>
          <span className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
            Analyse des taches
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-[42px]">
            {audit.section_title}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
            {audit.intro}
          </p>
        </ScrollReveal>

        <div ref={gridRef} className="mt-12 grid gap-4 md:grid-cols-2">
          {audit.tasks.map((task, i) => (
            <motion.div
              key={task.name}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </div>

        {/* Synthesis bar */}
        <ScrollReveal delay={0.3} className="mt-12">
          <div className="card-glow rounded-xl border border-border-subtle bg-bg-secondary p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-text-secondary">{audit.summary}</span>
              <span className="font-mono text-2xl font-bold text-text-accent">
                {Math.round((automatableTasks / totalTasks) * 100)}%
              </span>
            </div>
            <ProgressBar
              value={automatableTasks}
              max={totalTasks}
              showPercentage={false}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
