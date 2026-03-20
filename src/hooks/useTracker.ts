"use client";

import { useEffect, useRef, useCallback } from "react";
import { createTrackEvent } from "@/lib/tracking";
import type { EventType } from "@/lib/supabase/types";

export function useTracker(landingPageId: string, slug: string) {
  const scrollTracked = useRef<Set<string>>(new Set());
  const timeRef = useRef(0);

  // Track page view on mount
  useEffect(() => {
    createTrackEvent(landingPageId, slug, "page_view");
  }, [landingPageId, slug]);

  // Track scroll depth
  useEffect(() => {
    const sentinels = ["scroll-25", "scroll-50", "scroll-75", "scroll-100"];
    const eventMap: Record<string, EventType> = {
      "scroll-25": "scroll_25",
      "scroll-50": "scroll_50",
      "scroll-75": "scroll_75",
      "scroll-100": "scroll_100",
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !scrollTracked.current.has(id)) {
            scrollTracked.current.add(id);
            createTrackEvent(landingPageId, slug, eventMap[id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    sentinels.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [landingPageId, slug]);

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      timeRef.current += 30;
      createTrackEvent(landingPageId, slug, "time_update", {
        seconds: timeRef.current,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [landingPageId, slug]);

  const trackCta = useCallback(
    (type: EventType = "cta_click") => {
      createTrackEvent(landingPageId, slug, type);
    },
    [landingPageId, slug]
  );

  return { trackCta };
}
