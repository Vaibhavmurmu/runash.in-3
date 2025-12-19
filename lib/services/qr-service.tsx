"use client"

import { QrCode, Smartphone, Wifi, User, Globe } from "lucide-react"

export interface UPIData {
  payeeAddress: string
  payeeName?: string
  amount?: number
  currency?: string
  transactionNote?: string
  transactionRef?: string
  merchantCode?: string
  url?: string
}

export interface QRCodeData {
  type: "UPI" | "URL" | "TEXT" | "WIFI" | "CONTACT"
  data: any
  rawData: string
}

export interface QRScanResult {
  data: string
  timestamp: Date
  format?: string
  parsedData?: QRCodeData
}

export interface QRGenerateOptions {
  size?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
}

export class QrService {
  private static instance: QrService
  private scanHistory: QRScanResult[] = []

  private constructor() {}

  static getInstance(): QrService {
    if (!QrService.instance) {
      QrService.instance = new QrService()
    }
    return QrService.instance
  }

  /**
   * Parse UPI QR code data
   */
  parseUPIData(qrData: string): UPIData | null {
    try {
      // UPI QR codes typically start with "upi://pay?"
      if (!qrData.toLowerCase().startsWith("upi://pay?")) {
        return null
      }

      const url = new URL(qrData)
      const params = url.searchParams

      return {
        payeeAddress: params.get("pa") || "",
        payeeName: params.get("pn") || undefined,
        amount: params.get("am") ? Number.parseFloat(params.get("am")!) : undefined,
        currency: params.get("cu") || "INR",
        transactionNote: params.get("tn") || undefined,
        transactionRef: params.get("tr") || undefined,
        merchantCode: params.get("mc") || undefined,
        url: qrData,
      }
    } catch (error) {
      console.error("Error parsing UPI data:", error)
      return null
    }
  }

  /**
   * Generate UPI QR code data string
   */
  generateUPIData(data: UPIData): string {
    const params = new URLSearchParams()

    params.set("pa", data.payeeAddress)
    if (data.payeeName) params.set("pn", data.payeeName)
    if (data.amount) params.set("am", data.amount.toString())
    if (data.currency) params.set("cu", data.currency)
    if (data.transactionNote) params.set("tn", data.transactionNote)
    if (data.transactionRef) params.set("tr", data.transactionRef)
    if (data.merchantCode) params.set("mc", data.merchantCode)

    return `upi://pay?${params.toString()}`
  }

  /**
   * Parse any QR code data and determine its type
   */
  parseQRData(qrData: string): QRCodeData {
    const lowerData = qrData.toLowerCase()

    // UPI Payment
    if (lowerData.startsWith("upi://pay?")) {
      const upiData = this.parseUPIData(qrData)
      return {
        type: "UPI",
        data: upiData,
        rawData: qrData,
      }
    }

    // URL
    if (lowerData.startsWith("http://") || lowerData.startsWith("https://")) {
      return {
        type: "URL",
        data: { url: qrData },
        rawData: qrData,
      }
    }

    // WiFi
    if (lowerData.startsWith("wifi:")) {
      const wifiData = this.parseWiFiData(qrData)
      return {
        type: "WIFI",
        data: wifiData,
        rawData: qrData,
      }
    }

    // Contact (vCard)
    if (lowerData.startsWith("begin:vcard")) {
      const contactData = this.parseContactData(qrData)
      return {
        type: "CONTACT",
        data: contactData,
        rawData: qrData,
      }
    }

    // Default to text
    return {
      type: "TEXT",
      data: { text: qrData },
      rawData: qrData,
    }
  }

  /**
   * Parse WiFi QR code data
   */
  private parseWiFiData(qrData: string) {
    const match = qrData.match(/WIFI:T:([^;]*);S:([^;]*);P:([^;]*);H:([^;]*);?/)
    if (match) {
      return {
        type: match[1],
        ssid: match[2],
        password: match[3],
        hidden: match[4] === "true",
      }
    }
    return { raw: qrData }
  }

  /**
   * Parse contact (vCard) QR code data
   */
  private parseContactData(qrData: string) {
    const lines = qrData.split("\n")
    const contact: any = {}

    lines.forEach((line) => {
      if (line.startsWith("FN:")) contact.name = line.substring(3)
      if (line.startsWith("TEL:")) contact.phone = line.substring(4)
      if (line.startsWith("EMAIL:")) contact.email = line.substring(6)
      if (line.startsWith("ORG:")) contact.organization = line.substring(4)
    })

    return contact
  }

  /**
   * Get icon for QR code type
   */
  getQRIcon(type: QRCodeData["type"]) {
    switch (type) {
      case "UPI":
        return Smartphone
      case "URL":
        return Globe
      case "WIFI":
        return Wifi
      case "CONTACT":
        return User
      default:
        return QrCode
    }
  }

  /**
   * Get display title for QR code type
   */
  getQRTitle(data: QRCodeData): string {
    switch (data.type) {
      case "UPI":
        return data.data?.payeeName || data.data?.payeeAddress || "UPI Payment"
      case "URL":
        return "Website Link"
      case "WIFI":
        return `WiFi: ${data.data?.ssid || "Network"}`
      case "CONTACT":
        return data.data?.name || "Contact"
      default:
        return "QR Code"
    }
  }

  /**
   * Get display description for QR code type
   */
  getQRDescription(data: QRCodeData): string {
    switch (data.type) {
      case "UPI":
        const amount = data.data?.amount
        return amount ? `₹${amount.toLocaleString("en-IN")}` : "Tap to pay"
      case "URL":
        return data.data?.url || ""
      case "WIFI":
        return "Tap to connect"
      case "CONTACT":
        return data.data?.phone || data.data?.email || "Contact information"
      default:
        return data.rawData.length > 50 ? data.rawData.substring(0, 50) + "..." : data.rawData
    }
  }

  /**
   * Validate UPI ID format with comprehensive rules
   */
  validateUPIId(upiId: string): boolean {
    if (!upiId || typeof upiId !== "string") {
      return false
    }

    // Trim whitespace
    upiId = upiId.trim()

    // Must contain exactly one @ symbol
    const atCount = (upiId.match(/@/g) || []).length
    if (atCount !== 1) {
      return false
    }

    const [username, domain] = upiId.split("@")

    // Both parts must exist and not be empty
    if (!username || !domain) {
      return false
    }

    // Username validation
    if (!this.validateUPIUsername(username)) {
      return false
    }

    // Domain validation
    if (!this.validateUPIDomain(domain)) {
      return false
    }

    return true
  }

  /**
   * Validate UPI username part
   */
  private validateUPIUsername(username: string): boolean {
    // Cannot be empty
    if (!username) return false

    // Cannot start or end with dot
    if (username.startsWith(".") || username.endsWith(".")) return false

    // Can only contain letters, numbers, dots, underscores, and hyphens
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) return false

    // Cannot have consecutive dots
    if (username.includes("..")) return false

    return true
  }

  /**
   * Validate UPI domain part
   */
  private validateUPIDomain(domain: string): boolean {
    // Cannot be empty
    if (!domain) return false

    // Cannot start or end with dot or hyphen
    if (domain.startsWith(".") || domain.endsWith(".") || domain.startsWith("-") || domain.endsWith("-")) return false

    // Can only contain letters, numbers, dots, and hyphens
    if (!/^[a-zA-Z0-9.-]+$/.test(domain)) return false

    // Cannot have consecutive dots
    if (domain.includes("..")) return false

    // Must contain at least one letter (not just numbers and symbols)
    if (!/[a-zA-Z]/.test(domain)) return false

    return true
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency = "INR"): string {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`
    }
    return `${amount.toLocaleString()} ${currency}`
  }

  /**
   * Generate QR code for payment request
   */
  generatePaymentQR(data: {
    upiId: string
    name?: string
    amount?: number
    note?: string
  }): string {
    const upiData: UPIData = {
      payeeAddress: data.upiId,
      payeeName: data.name,
      amount: data.amount,
      currency: "INR",
      transactionNote: data.note,
      transactionRef: `TXN${Date.now()}`,
    }

    return this.generateUPIData(upiData)
  }

  /**
   * Generate QR code (mock implementation)
   */
  async generateQR(data: string, options?: QRGenerateOptions): Promise<string> {
    // Mock QR generation - in real implementation, use a QR library
    return new Promise((resolve) => {
      setTimeout(() => {
        const size = options?.size || 256
        resolve(
          `data:image/svg+xml;base64,${btoa(`
          <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="white"/>
            <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontFamily="monospace" fontSize="12">
              QR: ${data.substring(0, 20)}...
            </text>
          </svg>
        `)}`,
        )
      }, 100)
    })
  }

  /**
   * Generate UPI QR code
   */
  async generateUPIQR(
    upiId: string,
    amount?: number,
    name?: string,
    note?: string,
    options?: QRGenerateOptions,
  ): Promise<string> {
    const upiData = this.generatePaymentQR({ upiId, name, amount, note })
    return this.generateQR(upiData, options)
  }

  /**
   * Scan QR code (mock implementation)
   */
  async scanQR(imageData?: string): Promise<QRScanResult> {
    // Mock scanning - in real implementation, use a QR scanning library
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          reject(new Error("No QR code found"))
          return
        }

        const mockData = "upi://pay?pa=test@upi&pn=Test User&am=100&cu=INR"
        const result: QRScanResult = {
          data: mockData,
          timestamp: new Date(),
          format: "QR_CODE",
          parsedData: this.parseQRData(mockData),
        }

        this.scanHistory.push(result)
        resolve(result)
      }, 1000)
    })
  }

  /**
   * Get scan history
   */
  getScanHistory(): QRScanResult[] {
    return [...this.scanHistory]
  }

  /**
   * Clear scan history
   */
  clearHistory(): void {
    this.scanHistory = []
  }

  // Static methods for backward compatibility
  static parseUPIData = (qrData: string) => QrService.getInstance().parseUPIData(qrData)
  static generateUPIData = (data: UPIData) => QrService.getInstance().generateUPIData(data)
  static parseQRData = (qrData: string) => QrService.getInstance().parseQRData(qrData)
  static getQRIcon = (type: QRCodeData["type"]) => QrService.getInstance().getQRIcon(type)
  static getQRTitle = (data: QRCodeData) => QrService.getInstance().getQRTitle(data)
  static getQRDescription = (data: QRCodeData) => QrService.getInstance().getQRDescription(data)
  static isValidUPIId = (upiId: string) => QrService.getInstance().validateUPIId(upiId)
  static formatAmount = (amount: number, currency?: string) => QrService.getInstance().formatAmount(amount, currency)
  static generatePaymentQR = (data: { upiId: string; name?: string; amount?: number; note?: string }) =>
    QrService.getInstance().generatePaymentQR(data)
}

// React Hook for QR Service
export function useQRService() {
  const qrService = QrService.getInstance()

  return {
    // Service methods
    parseUPIData: qrService.parseUPIData.bind(qrService),
    generateUPIData: qrService.generateUPIData.bind(qrService),
    parseQRData: qrService.parseQRData.bind(qrService),
    getQRIcon: qrService.getQRIcon.bind(qrService),
    getQRTitle: qrService.getQRTitle.bind(qrService),
    getQRDescription: qrService.getQRDescription.bind(qrService),
    validateUPIId: qrService.validateUPIId.bind(qrService),
    formatAmount: qrService.formatAmount.bind(qrService),
    generatePaymentQR: qrService.generatePaymentQR.bind(qrService),
    generateQR: qrService.generateQR.bind(qrService),
    generateUPIQR: qrService.generateUPIQR.bind(qrService),
    scanQR: qrService.scanQR.bind(qrService),
    getScanHistory: qrService.getScanHistory.bind(qrService),
    clearHistory: qrService.clearHistory.bind(qrService),
  }
}

// Named exports for individual functions
export const parseUPIData = QrService.parseUPIData
export const generateUPIData = QrService.generateUPIData
export const parseQRData = QrService.parseQRData
export const getQRIcon = QrService.getQRIcon
export const getQRTitle = QrService.getQRTitle
export const getQRDescription = QrService.getQRDescription
export const isValidUPIId = QrService.isValidUPIId
export const formatAmount = QrService.formatAmount
export const generatePaymentQR = QrService.generatePaymentQR

// Default export
export default QrService
