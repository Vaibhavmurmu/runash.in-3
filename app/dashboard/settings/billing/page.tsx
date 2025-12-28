import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PRODUCTS } from "@/lib/products"
import { CheckoutButton } from "@/components/stripe/checkout-button"
import { Check } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
        <p className="text-muted-foreground">Manage your subscription plans and billing information.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-3xl font-bold">
                ${(product.priceInCents / 100).toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Core Platform Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited Usage</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority Support</span>
                </li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <CheckoutButton productId={product.id} label={product.id === "basic-plan" ? "Current Plan" : "Upgrade"} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
