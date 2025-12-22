import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type BankAccount = Database["public"]["Tables"]["bank_accounts"]["Row"]
type BankAccountInsert = Database["public"]["Tables"]["bank_accounts"]["Insert"]
type UpiId = Database["public"]["Tables"]["upi_ids"]["Row"]
type UpiIdInsert = Database["public"]["Tables"]["upi_ids"]["Insert"]

export class BankService {
  static async getBankAccounts(userId: string): Promise<{ data: BankAccount[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async addBankAccount(account: BankAccountInsert): Promise<{ data: BankAccount | null; error: any }> {
    try {
      // If this is set as primary, update other accounts
      if (account.is_primary) {
        await neon.from("bank_accounts").update({ is_primary: false }).eq("user_id", account.user_id)
      }

      const { data, error } = await neon.from("bank_accounts").insert(account).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateBankAccount(accountId: string, updates: Partial<BankAccount>): Promise<{ error: any }> {
    try {
      // If setting as primary, update other accounts
      if (updates.is_primary) {
        const { data: account } = await neon.from("bank_accounts").select("user_id").eq("id", accountId).single()

        if (account) {
          await neon.from("bank_accounts").update({ is_primary: false }).eq("user_id", account.user_id)
        }
      }

      const { error } = await neon.from("bank_accounts").update(updates).eq("id", accountId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async getUpiIds(userId: string): Promise<{ data: UpiId[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("upi_ids")
        .select(`
          *,
          bank_account:bank_accounts(bank_name, account_number)
        `)
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async addUpiId(upiId: UpiIdInsert): Promise<{ data: UpiId | null; error: any }> {
    try {
      // Check if UPI ID already exists
      const { data: existing } = await neon.from("upi_ids").select("id").eq("upi_id", upiId.upi_id).single()

      if (existing) {
        throw new Error("UPI ID already exists")
      }

      // If this is set as primary, update other UPI IDs
      if (upiId.is_primary) {
        await neon.from("upi_ids").update({ is_primary: false }).eq("user_id", upiId.user_id)
      }

      const { data, error } = await neon.from("upi_ids").insert(upiId).select().single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async checkBalance(accountId: string): Promise<{ data: number | null; error: any }> {
    try {
      const { data, error } = await neon.from("bank_accounts").select("balance").eq("id", accountId).single()

      if (error) throw error
      return { data: data.balance, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateBalance(accountId: string, newBalance: number): Promise<{ error: any }> {
    try {
      const { error } = await neon.from("bank_accounts").update({ balance: newBalance }).eq("id", accountId)

      return { error }
    } catch (error) {
      return { error }
    }
  }
  }
