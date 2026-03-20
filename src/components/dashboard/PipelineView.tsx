"use client";

import { PIPELINE_STAGES, STATUS_LABELS } from "@/lib/constants";
import StatusBadge from "./StatusBadge";
import type { JobOffer, JobOfferStatus } from "@/lib/supabase/types";

interface PipelineViewProps {
  offers: JobOffer[];
}

export default function PipelineView({ offers }: PipelineViewProps) {
  const grouped = PIPELINE_STAGES.reduce(
    (acc, status) => {
      acc[status] = offers.filter((o) => o.status === status);
      return acc;
    },
    {} as Record<JobOfferStatus, JobOffer[]>
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
        {PIPELINE_STAGES.map((status) => (
          <div
            key={status}
            className="w-56 shrink-0 rounded-xl border border-border-subtle bg-bg-secondary p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                {STATUS_LABELS[status]}
              </span>
              <span className="font-mono text-xs text-text-tertiary">
                {grouped[status].length}
              </span>
            </div>

            <div className="space-y-2">
              {grouped[status].slice(0, 10).map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-lg border border-border-subtle bg-bg-tertiary p-3"
                >
                  <p className="text-sm font-medium text-text-primary truncate">
                    {offer.company_name}
                  </p>
                  <p className="mt-0.5 text-xs text-text-tertiary truncate">
                    {offer.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    {offer.automation_score && (
                      <span className="font-mono text-xs text-text-accent">
                        {offer.automation_score}/10
                      </span>
                    )}
                    <span className="text-xs text-text-tertiary">
                      {new Date(offer.created_at).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              {grouped[status].length === 0 && (
                <p className="py-4 text-center text-xs text-text-tertiary">
                  Aucune offre
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
