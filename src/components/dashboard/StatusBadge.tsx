import Badge from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import type { JobOfferStatus } from "@/lib/supabase/types";

interface StatusBadgeProps {
  status: JobOfferStatus;
}

function getVariant(status: JobOfferStatus) {
  if (["booked", "converted", "visited"].includes(status)) return "success";
  if (["archived", "low_priority"].includes(status)) return "danger";
  if (["sent", "opened", "page_ready", "ready_to_send"].includes(status))
    return "warning";
  if (["qualified", "enriched", "matched"].includes(status)) return "info";
  return "neutral";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={getVariant(status)}>
      {STATUS_LABELS[status] || status}
    </Badge>
  );
}
