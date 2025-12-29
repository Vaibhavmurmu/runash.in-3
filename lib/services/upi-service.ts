import { neon } from "@/lib/neon/client"
import type { Database } from "@/lib/neon/types"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"]

export class TransactionService {
  static async createTransaction(transaction: TransactionInsert): Promise<{ data: Transaction | null; error: any }> {
    try {
      // Generate unique transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      const { data, error } = await neon
        .from("transactions")
        .insert({
          ...transaction,
          transaction_id: transactionId,
        })
        .select()
        .single()

      if (error) throw error

      // Create notification for receiver
      if (data.receiver_id) {
        await this.createTransactionNotification(data)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async getTransactions(userId: string, limit = 50): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      const { data, error } = await neon
        .from("transactions")
        .select(`
          *,
          sender:users!transactions_sender_id_fkey(full_name, phone),
          receiver:users!transactions_receiver_id_fkey(full_name, phone)
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  static async updateTransactionStatus(
    transactionId: string,
    status: Transaction["status"],
    failureReason?: string,
  ): Promise<{ error: any }> {
    try {
      const updates: any = { status }
      if (failureReason) updates.failure_reason = failureReason

      const { error } = await neon.from("transactions").update(updates).eq("transaction_id", transactionId)

      return { error }
    } catch (error) {
      return { error }
    }
  }

  static async processPayment(
    senderId: string,
    receiverUpiId: string,
    amount: number,
    note?: string,
  ): Promise<{ data: Transaction | null; error: any }> {
    try {
      // Find receiver by UPI ID
      const { data: receiverUpi, error: upiError } = await neon
        .from("upi_ids")
        .select("user_id")
        .eq("upi_id", receiverUpiId)
        .eq("is_active", true)
        .single()

      if (upiError || !receiverUpi) {
        throw new Error("Invalid UPI ID")
      }

      // Check sender's balance (simplified - in production, integrate with actual bank APIs)
      const { data: senderAccount, error: balanceError } = await neon
        .from("bank_accounts")
        .select("balance")
        .eq("user_id", senderId)
        .eq("is_primary", true)
        .single()

      if (balanceError || !senderAccount || senderAccount.balance < amount) {
        throw new Error("Insufficient balance")
      }

      // Create transaction
      const { data: transaction, error: txnError } = await this.createTransaction({
        sender_id: senderId,
        receiver_id: receiverUpi.user_id,
        amount,
        transaction_type: "SEND",
        status: "PENDING",
        note,
      })

      if (txnError || !transaction) throw txnError

      // Simulate payment processing (in production, integrate with UPI gateway)
      setTimeout(async () => {
        const success = Math.random() > 0.1 // 90% success rate for demo

        if (success) {
          // Update balances
          await neon.rpc("transfer_funds", {
            sender_id: senderId,
            receiver_id: receiverUpi.user_id,
            amount,
          })

          await this.updateTransactionStatus(transaction.transaction_id, "SUCCESS")
        } else {
          await this.updateTransactionStatus(transaction.transaction_id, "FAILED", "Payment gateway error")
        }
      }, 2000)

      return { data: transaction, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  private static async createTransactionNotification(transaction: Transaction) {
    const title = transaction.transaction_type === "SEND" ? "Payment Received" : "Payment Request"

    const message = `₹${transaction.amount} ${transaction.transaction_type === "SEND" ? "received" : "requested"}`

    await neon.from("notifications").insert({
      user_id: transaction.receiver_id!,
      title,
      message,
      type: "TRANSACTION",
      metadata: { transaction_id: transaction.id },
    })
  }
  }
