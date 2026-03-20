"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PageAnalytic } from "@/lib/supabase/types";

interface ActivityFeedProps {
  initialEvents: PageAnalytic[];
}

const eventConfig: Record<
  string,
  { color: string; label: string }
> = {
  page_view: { color: "bg-accent-primary", label: "a visit\u00e9 la page" },
  cta_click: { color: "bg-danger", label: "a cliqu\u00e9 sur le CTA" },
  calendly_click: {
    color: "bg-danger",
    label: "a cliqu\u00e9 sur Calendly",
  },
  calendly_booking: { color: "bg-success", label: "a book\u00e9 un call" },
  scroll_100: {
    color: "bg-warning",
    label: "a lu la page en entier",
  },
};

export default function ActivityFeed({ initialEvents }: ActivityFeedProps) {
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("analytics-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "page_analytics",
        },
        (payload) => {
          const newEvent = payload.new as PageAnalytic;
          // Only show significant events in the feed
          if (eventConfig[newEvent.event_type]) {
            setEvents((prev) => [newEvent, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const significantEvents = events.filter((e) => eventConfig[e.event_type]);

  return (
    <div className="rounded-xl border border-border-subtle bg-bg-secondary p-4">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-text-tertiary">
        Activit&eacute; r&eacute;cente
      </h3>

      <div className="space-y-3">
        {significantEvents.length === 0 && (
          <p className="py-4 text-center text-sm text-text-tertiary">
            Aucune activit&eacute; r&eacute;cente
          </p>
        )}

        {significantEvents.map((event) => {
          const config = eventConfig[event.event_type];
          if (!config) return null;

          return (
            <div key={event.id} className="flex items-start gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${config.color}`}
              />
              <div className="flex-1">
                <p className="text-sm text-text-secondary">
                  <span className="text-text-primary">
                    {(event.metadata as Record<string, string>)?.company_name ||
                      "Visiteur"}
                  </span>{" "}
                  {config.label}
                </p>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {new Date(event.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
