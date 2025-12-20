import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type PaymentLink = Database["public"]["Tables"]["payment_links"]["Row"]
type PaymentLinkInsert = Database["public"]["Tables"]["payment_links"]["Insert"]
type PaymentLinkTransaction = Database["public"]["Tables"]["payment_link_transactions"]["Row"]

export class PaymentLinkService {
  static async createPaymentLink(
    data: Omit<PaymentLinkInsert, "link_id">,
  ): Promise<{ data: PaymentLink | null; error: any }> {
    try {
      // Generate unique link ID
      const linkId = `pl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const { data: paymentLink, error } = await neon
        .from("payment_links")
        .insert({
          ...data,
          link_id: linkId,
        })
        .select()
        .single()

      if (error) throw error

      return { data: paymentLink, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getPaymentLinks(userId: string): Promise<{ data: PaymentLink[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("payment_links")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getPaymentLinkByLinkId(linkId: string): Promise<{ data: PaymentLink | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("payment_links")
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq("link_id", linkId)
        .eq("is_active", true)
        .single()

      if (error) throw error

      // Check if expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return { data: null, error: { message: "Payment link has expired" } }
      }

      // Check usage limit
      if (data.max_usage && data.usage_count >= data.max_usage) {
        return { data: null, error: { message: "Payment link usage limit reached" } }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updatePaymentLink(
    linkId: string,
    updates: Partial<PaymentLink>,
  ): Promise<{ data: PaymentLink | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("payment_links")
        .update(updates)
        .eq("link_id", linkId)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async deletePaymentLink(linkId: string): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("payment_links").delete().eq("link_id", linkId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async processPaymentLinkPayment(
    linkId: string,
    paymentData: {
      amount: number
      payerEmail?: string
      payerName?: string
      payerPhone?: string
    },
  ): Promise<{ data: PaymentLinkTransaction | null; error: any }> {
    try {
      // Get payment link details
      const { data: paymentLink, error: linkError } = await this.getPaymentLinkByLinkId(linkId)
      if (linkError || !paymentLink) {
        throw new Error("Invalid payment link")
      }

      // Validate amount
      if (paymentLink.is_fixed_amount && paymentData.amount !== paymentLink.amount) {
        throw new Error("Invalid payment amount")
      }

      if (!paymentLink.is_fixed_amount) {
        if (paymentLink.min_amount && paymentData.amount < paymentLink.min_amount) {
          throw new Error(`Minimum amount is ${paymentLink.min_amount}`)
        }
        if (paymentLink.max_amount && paymentData.amount > paymentLink.max_amount) {
          throw new Error(`Maximum amount is ${paymentLink.max_amount}`)
        }
      }

      // Create transaction
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const { data: transaction, error: txnError } = await neon
        .from("transactions")
        .insert({
          transaction_id: transactionId,
          receiver_id: paymentLink.user_id,
          amount: paymentData.amount,
          currency: paymentLink.currency,
          transaction_type: "PAYMENT_LINK",
          status: "PENDING",
          note: `Payment for: ${paymentLink.title}`,
        })
        .select()
        .single()

      if (txnError) throw txnError

      // Create payment link transaction record
      const { data: linkTransaction, error: linkTxnError } = await supabase
        .from("payment_link_transactions")
        .insert({
          payment_link_id: paymentLink.id,
          transaction_id: transaction.id,
          payer_email: paymentData.payerEmail,
          payer_name: paymentData.payerName,
          payer_phone: paymentData.payerPhone,
          amount_paid: paymentData.amount,
          currency: paymentLink.currency,
          status: "PENDING",
        })
        .select()
        .single()

      if (linkTxnError) throw linkTxnError

      // Simulate payment processing
      setTimeout(async () => {
        const success = Math.random() > 0.1 // 90% success rate

        if (success) {
          await neon.from("transactions").update({ status: "SUCCESS" }).eq("id", transaction.id)

          await neon.from("payment_link_transactions").update({ status: "SUCCESS" }).eq("id", linkTransaction.id)

          // Send notification to payment link owner
          await neon.from("notifications").insert({
            user_id: paymentLink.user_id,
            title: "Payment Received",
            message: `₹${paymentData.amount} received via payment link: ${paymentLink.title}`,
            type: "TRANSACTION",
            metadata: { transaction_id: transaction.id, payment_link_id: paymentLink.id },
          })
        } else {
          await neon
            .from("transactions")
            .update({ status: "FAILED", failure_reason: "Payment gateway error" })
            .eq("id", transaction.id)

          await neon.from("payment_link_transactions").update({ status: "FAILED" }).eq("id", linkTransaction.id)
        }
      }, 2000)

      return { data: linkTransaction, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getPaymentLinkTransactions(
    linkId: string,
  ): Promise<{ data: PaymentLinkTransaction[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("payment_link_transactions")
        .select(`
          *,
          transaction:transactions(*)
        `)
        .eq("payment_link_id", linkId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static generatePaymentUrl(linkId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://runash.in/pay"
    return `${baseUrl}/pay/${linkId}`
  }

  static generateQRCode(linkId: string): string {
    const paymentUrl = this.generatePaymentUrl(linkId)
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentUrl)}`
  }
  }
