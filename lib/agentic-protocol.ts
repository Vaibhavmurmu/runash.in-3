/**
 * Small helper to build the "Agentic Commerce Protocol" metadata payload.
 * This is attached as session.live_metadata when creating or updating sessions.
 *
 * The protocol is intentionally lightweight:
 * - intent: short text describing user's high-level intent
 * - shopping_flow: enumerated flow steps (discovery, demo, upsell, cart)
 * - proactive_push_to_cart: boolean
 * - product_ids: optional array of product ids to bias recommendations
 * - user_preferences: optional lightweight profile hints
 *
 * Keep this stable and serializable; assistants and server workers should rely on these keys.
 */

export function buildAgenticProtocol(prompt: string, opts?: Partial<Record<string, any>>) {
  const proto: any = {
    intent: inferIntentFromPrompt(prompt),
    shopping_flow: opts?.shopping_flow ?? "discovery->demo->upsell->cart",
    proactive_push_to_cart: Boolean(opts?.proactive_push_to_cart ?? true),
    product_ids: opts?.product_ids ?? [],
    user_preferences: opts?.user_preferences ?? {},
    origin: "home-hero",
    timestamp: new Date().toISOString(),
  }

  // Merge any additional fields
  if (opts) Object.assign(proto, opts)
  return proto
}

function inferIntentFromPrompt(prompt: string) {
  if (!prompt) return "general_shopping"
  const p = prompt.toLowerCase()
  if (p.includes("buy") || p.includes("add to cart") || p.includes("purchase")) return "purchase_intent"
  if (p.includes("demo") || p.includes("show")) return "product_demo"
  if (p.includes("recipe") || p.includes("cook")) return "recipe_intent"
  if (p.includes("bundle") || p.includes("bundle")) return "bundle_discovery"
  return "discover"
}
