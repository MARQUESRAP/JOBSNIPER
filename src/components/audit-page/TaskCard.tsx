"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { TaskContent } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: TaskContent;
}

function getTaskBadge(task: TaskContent) {
  if (task.automatable && task.score >= 7) {
    return { label: "Automatisable", variant: "success" as const };
  }
  if (task.automatable && task.score >= 4) {
    return { label: "Partiel", variant: "warning" as const };
  }
  return { label: "Humain requis", variant: "danger" as const };
}

function getScoreColor(score: number): string {
  if (score >= 7) return "bg-success";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function getScoreGlow(score: number): string {
  if (score >= 7) return "shadow-success/20";
  if (score >= 4) return "shadow-warning/20";
  return "shadow-danger/20";
}

export default function TaskCard({ task }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const badge = getTaskBadge(task);

  return (
    <div
      ref={ref}
      className="card-glow group rounded-xl border border-border-subtle bg-bg-secondary p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-default hover:shadow-xl hover:shadow-accent-primary/[0.03]"
    >
      <div className="mb-4 flex items-center justify-between">
        <Badge variant={badge.variant}>
          {badge.label}
        </Badge>
        <span className="font-mono text-sm font-bold text-text-primary opacity-60 group-hover:opacity-100 transition-opacity">
          {task.score}/10
        </span>
      </div>

      <h3 className="mb-3 text-lg font-semibold text-text-primary">
        {task.name}
      </h3>

      {/* Score bar */}
      <div className="mb-4">
        <div className="h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <motion.div
            className={cn("h-full rounded-full", getScoreColor(task.score))}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${task.score * 10}%` } : { width: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            style={{
              boxShadow: isInView ? `0 0 12px ${task.score >= 7 ? "rgba(34,197,94,0.3)" : task.score >= 4 ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}` : "none",
            }}
          />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">
        {task.explanation}
      </p>

      {task.automatable && task.agent_slug && (
        <div className="mt-4 flex items-center gap-1.5 text-xs text-text-accent opacity-70 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          <span>
            Agent{" "}
            {task.agent_slug
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>
      )}
    </div>
  );
}
