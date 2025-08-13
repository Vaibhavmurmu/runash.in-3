import { type NextRequest, NextResponse } from "next/server"
import { EmailBounceHandler } from "@/lib/email-bounce-handler"

// Webhook endpoint for processing bounce notifications from email service providers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different webhook formats (AWS SES, SendGrid, Mailgun, etc.)
    const bounceEvents = await parseBounceWebhook(body, request.headers)

    let processed = 0
    let errors = 0

    for (const bounceEvent of bounceEvents) {
      try {
        const success = await EmailBounceHandler.processBounce(bounceEvent)
        if (success) {
          processed++
        } else {
          errors++
        }
      } catch (error) {
        console.error("Error processing bounce event:", error)
        errors++
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      errors,
    })
  } catch (error) {
    console.error("Error processing bounce webhook:", error)
    return NextResponse.json({ error: "Failed to process bounce webhook" }, { status: 500 })
  }
}

// Parse bounce webhook from different providers
async function parseBounceWebhook(
  body: any,
  headers: Headers,
): Promise<
  Array<{
    message_id: string
    recipient_email: string
    bounce_type: "hard" | "soft" | "complaint"
    bounce_subtype?: string
    reason: string
    diagnostic_code?: string
    timestamp: Date
    raw_data?: Record<string, any>
  }>
> {
  const events: any[] = []

  // AWS SES format
  if (body.Type === "Notification" && body.Message) {
    const message = JSON.parse(body.Message)

    if (message.notificationType === "Bounce") {
      const bounce = message.bounce
      for (const recipient of bounce.bouncedRecipients) {
        events.push({
          message_id: message.mail.messageId || `unknown_${Date.now()}`,
          recipient_email: recipient.emailAddress,
          bounce_type: bounce.bounceType === "Permanent" ? "hard" : "soft",
          bounce_subtype: bounce.bounceSubType,
          reason: recipient.diagnosticCode || bounce.bounceSubType,
          diagnostic_code: recipient.diagnosticCode,
          timestamp: new Date(bounce.timestamp),
          raw_data: message,
        })
      }
    } else if (message.notificationType === "Complaint") {
      for (const recipient of message.complaint.complainedRecipients) {
        events.push({
          message_id: message.mail.messageId || `unknown_${Date.now()}`,
          recipient_email: recipient.emailAddress,
          bounce_type: "complaint" as const,
          reason: "Spam complaint",
          timestamp: new Date(message.complaint.timestamp),
          raw_data: message,
        })
      }
    }
  }

  // SendGrid format
  else if (Array.isArray(body)) {
    for (const event of body) {
      if (event.event === "bounce" || event.event === "dropped") {
        events.push({
          message_id: event.sg_message_id || `unknown_${Date.now()}`,
          recipient_email: event.email,
          bounce_type: event.type === "bounce" ? "hard" : "soft",
          reason: event.reason || "Unknown bounce",
          timestamp: new Date(event.timestamp * 1000),
          raw_data: event,
        })
      } else if (event.event === "spamreport") {
        events.push({
          message_id: event.sg_message_id || `unknown_${Date.now()}`,
          recipient_email: event.email,
          bounce_type: "complaint" as const,
          reason: "Spam complaint",
          timestamp: new Date(event.timestamp * 1000),
          raw_data: event,
        })
      }
    }
  }

  // Mailgun format
  else if (body["event-data"]) {
    const eventData = body["event-data"]
    if (eventData.event === "failed" || eventData.event === "complained") {
      events.push({
        message_id: eventData.message?.headers?.["message-id"] || `unknown_${Date.now()}`,
        recipient_email: eventData.recipient,
        bounce_type:
          eventData.event === "complained" ? "complaint" : eventData.severity === "permanent" ? "hard" : "soft",
        reason: eventData["delivery-status"]?.description || "Unknown bounce",
        diagnostic_code: eventData["delivery-status"]?.code,
        timestamp: new Date(eventData.timestamp * 1000),
        raw_data: eventData,
      })
    }
  }

  // Generic format fallback
  else if (body.email && body.event) {
    events.push({
      message_id: body.message_id || `unknown_${Date.now()}`,
      recipient_email: body.email,
      bounce_type: body.bounce_type || "hard",
      reason: body.reason || "Unknown bounce",
      timestamp: new Date(body.timestamp || Date.now()),
      raw_data: body,
    })
  }

  return events
}
