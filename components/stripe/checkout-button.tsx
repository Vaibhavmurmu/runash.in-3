"use client"

import * as React from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutButton({ productId, label = "Upgrade Now" }: { productId: string; label?: string }) {
  const fetchClientSecret = React.useCallback(async () => {
    const { clientSecret } = await createCheckoutSession(productId)
    return clientSecret as string
  }, [productId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Complete your purchase</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-6">
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}
