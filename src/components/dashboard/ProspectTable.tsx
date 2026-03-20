"use client";

import { useState, useMemo, Fragment } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { PIPELINE_STAGES, STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { JobOffer, JobOfferStatus } from "@/lib/supabase/types";

interface ProspectTableProps {
  offers: (JobOffer & { landing_page_slug?: string })[];
}

type SortKey = "automation_score" | "created_at";
type SortDir = "asc" | "desc";

export default function ProspectTable({ offers }: ProspectTableProps) {
  const [filterStatus, setFilterStatus] = useState<JobOfferStatus | "all">(
    "all"
  );
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result =
      filterStatus === "all"
        ? offers
        : offers.filter((o) => o.status === filterStatus);

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [offers, filterStatus, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div>
      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as JobOfferStatus | "all")
          }
          className="rounded-lg border border-border-default bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-border-accent focus:outline-none"
        >
          <option value="all">Tous les statuts</option>
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
          <option value="archived">{STATUS_LABELS.archived}</option>
          <option value="low_priority">{STATUS_LABELS.low_priority}</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-secondary">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Entreprise
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Poste
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary hover:text-text-primary"
                onClick={() => toggleSort("automation_score")}
              >
                Score{" "}
                {sortKey === "automation_score" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Statut
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary hover:text-text-primary"
                onClick={() => toggleSort("created_at")}
              >
                Date{" "}
                {sortKey === "created_at" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-tertiary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((offer) => (
              <Fragment key={offer.id}>
                <tr
                  className="cursor-pointer border-b border-border-subtle transition-colors hover:bg-bg-tertiary"
                  onClick={() =>
                    setExpandedId(expandedId === offer.id ? null : offer.id)
                  }
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {offer.company_name}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {offer.title}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-text-accent">
                      {offer.automation_score ?? "-"}/10
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={offer.status} />
                  </td>
                  <td className="px-4 py-3 text-text-tertiary">
                    {new Date(offer.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {offer.landing_page_slug && (
                        <a
                          href={`/${offer.landing_page_slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-text-accent hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Page
                        </a>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-text-tertiary transition-transform",
                          expandedId === offer.id && "rotate-180"
                        )}
                      />
                    </div>
                  </td>
                </tr>
                {expandedId === offer.id && (
                  <tr key={`${offer.id}-details`}>
                    <td colSpan={6} className="bg-bg-tertiary px-6 py-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                            Description
                          </h4>
                          <p className="mt-1 text-sm text-text-secondary">
                            {offer.description || "Pas de description"}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
                            D&eacute;tails
                          </h4>
                          <div className="mt-1 space-y-1 text-sm text-text-secondary">
                            <p>
                              Lieu : {offer.location || "Non renseign\u00e9"}
                            </p>
                            <p>
                              Contrat : {offer.contract_type || "Non renseign\u00e9"}
                            </p>
                            <p>
                              Ratio automatisation :{" "}
                              {offer.automation_ratio
                                ? `${offer.automation_ratio}%`
                                : "N/A"}
                            </p>
                            {offer.rejection_reason && (
                              <p className="text-danger">
                                Rejet : {offer.rejection_reason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-text-tertiary"
                >
                  Aucun prospect trouv&eacute;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
