"use client"

import { useState, useEffect, useCallback } from "react"

interface ExchangeRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

interface ConversionResult {
  originalAmount: number
  convertedAmount: number
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
}

const SUPPORTED_CURRENCIES = ["USD", "INR"]

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  INR: "₹",
  
}

// Mock exchange rates - in production, these would come from a real API
const MOCK_RATES: Record<string, number> = {
  "USD-INR": 83.0,
  "INR-USD": 0.012,
}

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockRates: ExchangeRate[] = Object.entries(MOCK_RATES).map(([pair, rate]) => {
        const [from, to] = pair.split("-")
        return {
          from,
          to,
          rate,
          lastUpdated: new Date(),
        }
      })

      setRates(mockRates)
    } catch (err) {
      setError("Failed to fetch exchange rates")
      console.error("Exchange rate fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  const getRate = useCallback(
    (from: string, to: string): number => {
      if (from === to) return 1

      const directRate = rates.find((r) => r.from === from && r.to === to)
      if (directRate) return directRate.rate

      // Try reverse rate
      const reverseRate = rates.find((r) => r.from === to && r.to === from)
      if (reverseRate) return 1 / reverseRate.rate

      // Fallback to mock rates
      const mockRate = MOCK_RATES[`${from}-${to}`]
      if (mockRate) return mockRate

      const reverseMockRate = MOCK_RATES[`${to}-${from}`]
      if (reverseMockRate) return 1 / reverseMockRate

      return 1
    },
    [rates],
  )

  return {
    rates,
    loading,
    error,
    fetchRates,
    getRate,
    supportedCurrencies: SUPPORTED_CURRENCIES,
  }
}

export function useCurrencyConverter() {
  const { getRate } = useExchangeRates()
  const [converting, setConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convertCurrency = useCallback(
    async (amount: number, fromCurrency: string, toCurrency: string): Promise<ConversionResult> => {
      setConverting(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const exchangeRate = getRate(fromCurrency, toCurrency)
        const convertedAmount = amount * exchangeRate

        return {
          originalAmount: amount,
          convertedAmount: Math.round(convertedAmount * 100) / 100,
          fromCurrency,
          toCurrency,
          exchangeRate,
        }
      } catch (err) {
        const errorMessage = "Currency conversion failed"
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setConverting(false)
      }
    },
    [getRate],
  )

  const formatCurrency = useCallback((amount: number, currency: string, locale = "en-US"): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } catch (err) {
      // Fallback formatting
      const symbol = CURRENCY_SYMBOLS[currency] || currency
      return `${symbol}${amount.toFixed(2)}`
    }
  }, [])

  const getCurrencySymbol = useCallback((currency: string): string => {
    return CURRENCY_SYMBOLS[currency] || currency
  }, [])

  const getSupportedCurrencies = useCallback((): string[] => {
    return SUPPORTED_CURRENCIES
  }, [])

  return {
    convertCurrency,
    formatCurrency,
    getCurrencySymbol,
    getSupportedCurrencies,
    converting,
    error,
  }
}
