interface ExchangeRate {
  from_currency: string
  to_currency: string
  rate: number
  last_updated: string
}

interface ConversionRequest {
  amount: number
  fromCurrency: string
  toCurrency: string
}

interface ConversionResponse {
  originalAmount: number
  convertedAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
  lastUpdated: string
}

export class ExchangeRateService {
  private static instance: ExchangeRateService
  private cache: Map<string, { rate: number; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 60 * 60 * 1000 // 1 hour

  static getInstance(): ExchangeRateService {
    if (!ExchangeRateService.instance) {
      ExchangeRateService.instance = new ExchangeRateService()
    }
    return ExchangeRateService.instance
  }

  async getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
    if (fromCurrency === toCurrency) return 1

    const cacheKey = `${fromCurrency}-${toCurrency}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.rate
    }

    try {
      const response = await fetch("/api/exchange-rates/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromCurrency, toCurrency }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate")
      }

      const data = await response.json()
      const rate = data.rate

      // Cache the result
      this.cache.set(cacheKey, { rate, timestamp: Date.now() })

      return rate
    } catch (error) {
      console.error("Error fetching exchange rate:", error)

      // Return cached rate if available, even if expired
      if (cached) {
        return cached.rate
      }

      // Fallback rates for common conversions
      const fallbackRates: Record<string, number> = {
        "USD-INR": 83.0,
        "INR-USD": 0.012,
        "EUR-USD": 1.1,
        "USD-EUR": 0.91,
        "GBP-USD": 1.25,
        "USD-GBP": 0.8,
      }

      return fallbackRates[cacheKey] || 1
    }
  }

  async convertCurrency(request: ConversionRequest): Promise<ConversionResponse> {
    try {
      const response = await fetch("/api/exchange-rates/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Failed to convert currency")
      }

      return await response.json()
    } catch (error) {
      console.error("Error converting currency:", error)

      // Fallback conversion
      const rate = await this.getExchangeRate(request.fromCurrency, request.toCurrency)
      return {
        originalAmount: request.amount,
        convertedAmount: request.amount * rate,
        fromCurrency: request.fromCurrency,
        toCurrency: request.toCurrency,
        exchangeRate: rate,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  async getAllRates(): Promise<ExchangeRate[]> {
    try {
      const response = await fetch("/api/exchange-rates/update")
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching all rates:", error)
      return []
    }
  }

  formatCurrency(amount: number, currency: string, locale = "en-US"): string {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (error) {
      console.error("Error formatting currency:", error)
      return `${currency} ${amount.toFixed(2)}`
    }
  }

  getSupportedCurrencies(): string[] {
    return ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SGD"]
  }

  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      USD: "$",
      INR: "₹",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      AUD: "A$",
      CAD: "C$",
      CHF: "CHF",
      CNY: "¥",
      SGD: "S$",
    }
    return symbols[currency] || currency
  }
}

export const exchangeRateService = ExchangeRateService.getInstance()
