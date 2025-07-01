import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidInteger } from "@/lib/auth"
import { stripeService } from "@/lib/stripe"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    // Get user's current subscription with plan details
    const subscriptions = await sql`
      SELECT 
        us.*,
        sp.name as plan_name,
        sp.description as plan_description,
        sp.price_monthly,
        sp.price_yearly,
        sp.features,
        sp.limits
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = ${Number.parseInt(userId)}
      AND us.status IN ('active', 'past_due')
      ORDER BY us.created_at DESC
      LIMIT 1
    `

    const subscription = subscriptions.length > 0 ? subscriptions[0] : null

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { planId, billingCycle = "monthly" } = body

    // Get the plan details
    const plans = await sql`
      SELECT * FROM subscription_plans WHERE id = ${planId} AND is_active = true
    `

    if (plans.length === 0) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const plan = plans[0]

    // Check if user already has an active subscription
    const existingSubscriptions = await sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${Number.parseInt(userId)} 
      AND status IN ('active', 'past_due')
    `

    if (existingSubscriptions.length > 0) {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 })
    }

    // Create subscription in Stripe (simulated)
    const stripeSubscription = await stripeService.createSubscription(
      `cus_${userId}`,
      billingCycle === "yearly" ? `price_yearly_${planId}` : `price_monthly_${planId}`,
    )

    // Create subscription in database
    const now = new Date()
    const periodEnd = new Date(now)
    if (billingCycle === "yearly") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1)
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1)
    }

    const newSubscriptions = await sql`
      INSERT INTO user_subscriptions (
        user_id, plan_id, status, billing_cycle, 
        current_period_start, current_period_end, stripe_subscription_id
      ) VALUES (
        ${Number.parseInt(userId)}, ${planId}, 'active', ${billingCycle},
        ${now}, ${periodEnd}, ${stripeSubscription.id}
      ) RETURNING *
    `

    return NextResponse.json({ subscription: newSubscriptions[0] })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    if (!isValidInteger(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { action, planId, billingCycle } = body

    // Get current subscription
    const subscriptions = await sql`
      SELECT * FROM user_subscriptions 
      WHERE user_id = ${Number.parseInt(userId)} 
      AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    const subscription = subscriptions[0]

    switch (action) {
      case "cancel":
        // Cancel subscription in Stripe
        await stripeService.cancelSubscription(subscription.stripe_subscription_id)

        // Update subscription in database
        const canceledSubscriptions = await sql`
          UPDATE user_subscriptions 
          SET 
            status = 'canceled',
            cancel_at_period_end = true,
            canceled_at = NOW(),
            updated_at = NOW()
          WHERE id = ${subscription.id}
          RETURNING *
        `

        return NextResponse.json({ subscription: canceledSubscriptions[0] })

      case "reactivate":
        // Reactivate subscription in Stripe
        await stripeService.updateSubscription(subscription.stripe_subscription_id, {
          cancel_at_period_end: false,
        })

        // Update subscription in database
        const reactivatedSubscriptions = await sql`
          UPDATE user_subscriptions 
          SET 
            status = 'active',
            cancel_at_period_end = false,
            canceled_at = NULL,
            updated_at = NOW()
          WHERE id = ${subscription.id}
          RETURNING *
        `

        return NextResponse.json({ subscription: reactivatedSubscriptions[0] })

      case "change_plan":
        if (!planId) {
          return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
        }

        // Update subscription plan
        const updatedSubscriptions = await sql`
          UPDATE user_subscriptions 
          SET 
            plan_id = ${planId},
            billing_cycle = ${billingCycle || subscription.billing_cycle},
            updated_at = NOW()
          WHERE id = ${subscription.id}
          RETURNING *
        `

        return NextResponse.json({ subscription: updatedSubscriptions[0] })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
