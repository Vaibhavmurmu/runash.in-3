import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type BillCategory = Database["public"]["Tables"]["bill_categories"]["Row"]
type BillProvider = Database["public"]["Tables"]["bill_providers"]["Row"]
type UserBill = Database["public"]["Tables"]["user_bills"]["Row"]
type BillPayment = Database["public"]["Tables"]["bill_payments"]["Row"]

export class BillService {
  static async getBillCategories(): Promise<{ data: BillCategory[] | null; error: any }> {
    try {
      const { data, error } = await neon.from("bill_categories").select("*").eq("is_active", true).order("name")

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getBillProviders(categoryId: string): Promise<{ data: BillProvider[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("bill_providers")
        .select("*")
        .eq("category_id", categoryId)
        .eq("is_active", true)
        .order("name")

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getUserBills(userId: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("user_bills")
        .select(`
          *,
          provider:bill_providers(*),
          category:bill_providers(bill_categories(*))
        `)
        .eq("user_id", userId)
        .order("is_favorite", { ascending: false })
        .order("created_at", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async addUserBill(
    bill: Omit<UserBill, "id" | "created_at" | "updated_at">,
  ): Promise<{ data: UserBill | null; error: any }> {
    try {
      const { data, error } = await neon.from("user_bills").insert(bill).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async fetchBillDetails(providerId: string, consumerNumber: string): Promise<{ data: any | null; error: any }> {
    try {
      // This would integrate with actual bill fetch APIs
      const response = await fetch("/api/bills/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
          consumerNumber,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async payBill(payment: {
    userBillId: string
    billAmount: number
    convenienceFee?: number
    paymentMethod?: string
  }): Promise<{ data: BillPayment | null; error: any }> {
    try {
      const response = await fetch("/api/bills/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payment),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      return { data: result.data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getBillPaymentHistory(userId: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("bill_payments")
        .select(`
          *,
          user_bill:user_bills(
            nickname,
            consumer_number,
            provider:bill_providers(name, code)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async toggleAutopay(userBillId: string, enabled: boolean, amountLimit?: number): Promise<{ error: any }> {
    try {
      const updates: any = { is_autopay_enabled: enabled }
      if (amountLimit) updates.autopay_amount_limit = amountLimit

      const { error } = await neon.from("user_bills").update(updates).eq("id", userBillId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async setReminder(userBillId: string, reminderDays: number): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("user_bills").update({ reminder_days: reminderDays }).eq("id", userBillId)

      return { error }
    } catch (error) {
      return { error }
    }
  }
  }
