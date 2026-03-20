import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { TrackEvent } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  try {
    const body: TrackEvent = await request.json();

    if (!body.event_type || !body.landing_page_id || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Get client IP from headers (behind Traefik reverse proxy)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    // Insert into page_analytics
    await supabase.from("page_analytics").insert({
      landing_page_id: body.landing_page_id,
      event_type: body.event_type,
      visitor_id: body.visitor_id,
      visitor_ip: ip,
      visitor_device: body.device,
      time_on_page: body.metadata?.seconds
        ? Number(body.metadata.seconds)
        : null,
      referrer: body.referrer,
      metadata: body.metadata || null,
    });

    // Forward important events to n8n webhook (fire and forget)
    const forwardEvents = [
      "page_view",
      "cta_click",
      "calendly_click",
      "calendly_booking",
    ];
    if (
      forwardEvents.includes(body.event_type) &&
      process.env.TRACKING_WEBHOOK_URL
    ) {
      fetch(process.env.TRACKING_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...body,
          visitor_ip: ip,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Fire and forget — don't block on webhook failure
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
