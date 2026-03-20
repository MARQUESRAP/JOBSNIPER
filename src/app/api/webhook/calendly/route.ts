import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Calendly webhook payload structure
    const event = body.event; // "invitee.created"
    const payload = body.payload;

    if (event !== "invitee.created" || !payload) {
      return NextResponse.json({ received: true });
    }

    const invitee = payload.invitee || payload;
    const bookingInfo = {
      name: invitee.name || invitee.first_name || "Inconnu",
      email: invitee.email || null,
      event_start: payload.event?.start_time || payload.scheduled_event?.start_time || null,
      event_uri: payload.event?.uri || payload.scheduled_event?.uri || null,
    };

    const supabase = createServiceClient();

    // Try to match booking to a campaign by email
    if (bookingInfo.email) {
      const { data: campaign } = await supabase
        .from("email_campaigns")
        .select("id, landing_page_id")
        .eq("recipient_email", bookingInfo.email)
        .single();

      if (campaign) {
        // Update campaign status to booked
        await supabase
          .from("email_campaigns")
          .update({
            status: "booked",
            booked_at: new Date().toISOString(),
          })
          .eq("id", campaign.id);

        // Insert calendly_booking event
        if (campaign.landing_page_id) {
          await supabase.from("page_analytics").insert({
            landing_page_id: campaign.landing_page_id,
            event_type: "calendly_booking",
            metadata: bookingInfo,
          });
        }
      }
    }

    // Forward to n8n webhook for Telegram alert
    if (process.env.TRACKING_WEBHOOK_URL) {
      fetch(process.env.TRACKING_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "calendly_booking",
          ...bookingInfo,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
