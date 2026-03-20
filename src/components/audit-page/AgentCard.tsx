"use client";

import { Zap, Target, BarChart3, RefreshCw, Clock, Plug } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { AgentContent } from "@/lib/supabase/types";

interface AgentCardProps {
  agent: AgentContent;
  isPrimary?: boolean;
}

const capabilityIcons = [Zap, Target, BarChart3, RefreshCw];

export default function AgentCard({
  agent,
  isPrimary = true,
}: AgentCardProps) {
  return (
    <div className="card-glow rounded-xl border border-border-subtle bg-bg-tertiary p-6 md:p-8 border-l-[3px] border-l-accent-primary">
      <div className="mb-4 flex items-center gap-3">
        <h3 className="font-display text-xl font-bold text-text-primary">
          {agent.name}
        </h3>
        <Badge variant={isPrimary ? "info" : "neutral"}>
          {isPrimary ? "Agent principal" : "Agent compl\u00e9mentaire"}
        </Badge>
      </div>

      <p className="mb-6 text-text-secondary leading-relaxed">
        {agent.description}
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {agent.key_capabilities?.map((capability, i) => {
          const Icon = capabilityIcons[i % capabilityIcons.length];
          return (
            <div key={i} className="group flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10 transition-colors duration-300 group-hover:bg-accent-primary/20">
                <Icon className="h-4 w-4 text-text-accent" />
              </div>
              <span className="text-sm text-text-secondary">{capability}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-text-tertiary">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {agent.setup_time}
        </span>
        {agent.integration_note && (
          <span className="flex items-center gap-1.5">
            <Plug className="h-3.5 w-3.5" />
            {agent.integration_note}
          </span>
        )}
      </div>
    </div>
  );
}
