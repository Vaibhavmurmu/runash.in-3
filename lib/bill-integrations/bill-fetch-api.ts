// Bill Fetch API Integration
export class BillFetchAPI {
  private static readonly BASE_URL = process.env.BILL_FETCH_API_URL || "https://api.billfetch.com/v1"
  private static readonly API_KEY = process.env.BILL_FETCH_API_KEY

  static async fetchBill(providerCode: string, consumerNumber: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          operator: providerCode,
          canumber: consumerNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bill")
      }

      return {
        billNumber: data.billnumber,
        billDate: data.billdate,
        dueDate: data.duedate,
        billAmount: data.amount,
        consumerName: data.customername,
        billingAddress: data.address,
        billPeriod: data.billperiod,
        status: data.status,
      }
    } catch (error) {
      throw error
    }
  }

  static async payBill(
    providerCode: string,
    consumerNumber: string,
    amount: number,
    billNumber?: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.API_KEY}`,
        },
        body: JSON.stringify({
          operator: providerCode,
          canumber: consumerNumber,
          amount,
          billnumber: billNumber,
          mode: "UPI",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Payment failed")
      }

      return {
        transactionId: data.txnid,
        status: data.status,
        message: data.message,
        operatorRef: data.operatorref,
      }
    } catch (error) {
      throw error
    }
  }

  static async getTransactionStatus(transactionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/status/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to get status")
      }

      return {
        transactionId: data.txnid,
        status: data.status,
        amount: data.amount,
        operatorRef: data.operatorref,
        timestamp: data.timestamp,
      }
    } catch (error) {
      throw error
    }
  }
}
