import { type NextRequest, NextResponse } from "next/server"
import { EmailBounceHandler } from "@/lib/email-bounce-handler"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, reason } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const success = await EmailBounceHandler.processUnsubscribe(email, reason)

    if (!success) {
      return NextResponse.json({ error: "Failed to process unsubscribe" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed",
    })
  } catch (error) {
    console.error("Error processing unsubscribe:", error)
    return NextResponse.json({ error: "Failed to process unsubscribe" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    if (!email) {
      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribe</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .container { text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Unsubscribe</h1>
            <p class="error">Invalid unsubscribe link. Email parameter is missing.</p>
          </div>
        </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } },
      )
    }

    // Process unsubscribe
    const success = await EmailBounceHandler.processUnsubscribe(email, "Unsubscribed via link")

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe ${success ? "Successful" : "Failed"}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px; 
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            min-height: 100vh;
          }
          .container { 
            background: rgba(255, 255, 255, 0.95); 
            backdrop-filter: blur(20px); 
            border-radius: 20px; 
            padding: 40px; 
            text-align: center; 
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .success { color: #28a745; }
          .error { color: #dc3545; }
          h1 { color: #1a1a1a; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unsubscribe ${success ? "Successful" : "Failed"}</h1>
          ${
            success
              ? `
            <p class="success">✓ You have been successfully unsubscribed from our mailing list.</p>
            <p>Email: <strong>${email}</strong></p>
            <p>You will no longer receive emails from us.</p>
          `
              : `
            <p class="error">✗ Failed to process your unsubscribe request.</p>
            <p>Please try again or contact support.</p>
          `
          }
        </div>
      </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } },
    )
  } catch (error) {
    console.error("Error processing unsubscribe:", error)
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribe Error</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
          .container { text-align: center; }
          .error { color: #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Unsubscribe Error</h1>
          <p class="error">An error occurred while processing your unsubscribe request.</p>
          <p>Please try again or contact support.</p>
        </div>
      </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } },
    )
  }
}
