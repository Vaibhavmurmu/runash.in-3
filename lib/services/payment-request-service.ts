import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type PaymentRequest = Database["public"]["Tables"]["payment_requests"]["Row"]
type PaymentRequestInsert = Database["public"]["Tables"]["payment_requests"]["Insert"]

export class PaymentRequestService {
  static async createPaymentRequest(
    request: PaymentRequestInsert,
  ): Promise<{ data: PaymentRequest | null; error: any }> {
    try {
      const { data, error } = await neon.from("payment_requests").insert(request).select().single()

      if (error) throw error

      // Create notification for payer
      await neon.from("notifications").insert({
        user_id: request.payer_id,
        title: "Payment Request",
        message: `₹${request.amount} requested`,
        type: "PAYMENT_REQUEST",
        metadata: { request_id: data.id },
      })

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getPaymentRequests(userId: string): Promise<{ data: PaymentRequest[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("payment_requests")
        .select(`
          *,
          requester:users!payment_requests_requester_id_fkey(full_name, phone),
          payer:users!payment_requests_payer_id_fkey(full_name, phone)
        `)
        .or(`requester_id.eq.${userId},payer_id.eq.${userId}`)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateRequestStatus(requestId: string, status: PaymentRequest["status"]): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("payment_requests").update({ status }).eq("id", requestId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async payRequest(requestId: string): Promise<{ error: any }> {
    try {
      // Get request details
      const { data: request, error: requestError } = await neon
        .from("payment_requests")
        .select("*")
        .eq("id", requestId)
        .single()

      if (requestError || !request) throw new Error("Request not found")

      if (request.status !== "PENDING") {
        throw new Error("Request is not pending")
      }

      // Process payment using TransactionService
      const { TransactionService } = await import("./transaction-service")

      // Get payer's primary UPI ID
      const { data: payerUpi, error: upiError } = await neon
        .from("upi_ids")
        .select("upi_id")
        .eq("user_id", request.payer_id)
        .eq("is_primary", true)
        .single()

      if (upiError || !payerUpi) throw new Error("Payer UPI not found")

      // Get requester's primary UPI ID
      const { data: requesterUpi, error: requesterUpiError } = await neon
        .from("upi_ids")
        .select("upi_id")
        .eq("user_id", request.requester_id)
        .eq("is_primary", true)
        .single()

      if (requesterUpiError || !requesterUpi) throw new Error("Requester UPI not found")

      const { error: paymentError } = await TransactionService.processPayment(
        request.payer_id,
        requesterUpi.upi_id,
        request.amount,
        request.note || "Payment request fulfillment",
      )

      if (paymentError) throw paymentError

      // Update request status
      await this.updateRequestStatus(requestId, "PAID")

      return { error: null }
    } catch (error) {
      return { error }
    }
  }
  }
