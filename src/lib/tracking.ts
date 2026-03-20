import type { TrackEvent, EventType } from "@/lib/supabase/types";

let visitorId: string | null = null;

export function getVisitorId(): string {
  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }
  return visitorId;
}

export function detectDevice(): "mobile" | "tablet" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
    return "mobile";
  return "desktop";
}

export function sendTrackEvent(
  event: Omit<TrackEvent, "visitor_id" | "device" | "referrer">
): void {
  const payload: TrackEvent = {
    ...event,
    visitor_id: getVisitorId(),
    device: detectDevice(),
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
  };

  const url = "/api/track";
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Silently fail — tracking should never break the UX
    });
  }
}

export function createTrackEvent(
  landingPageId: string,
  slug: string,
  eventType: EventType,
  metadata?: Record<string, unknown>
) {
  sendTrackEvent({
    event_type: eventType,
    landing_page_id: landingPageId,
    slug,
    metadata,
  });
}
