"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Check, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useExchangeRates } from "@/lib/hooks/use-exchange-rates"

interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
  rate: number
  change24h: number
  popular: boolean
}

export default function CurrencySelectorPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("INR")
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const { rates, loading, error, refreshRates } = useExchangeRates()

  const currencies: Currency[] = [
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 1, change24h: 0, popular: true },
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 0.012, change24h: 0.15, popular: true },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.011, change24h: -0.08, popular: true },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.0095, change24h: 0.22, popular: true },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 1.85, change24h: -0.12, popular: true },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rate: 0.018, change24h: 0.31, popular: true },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rate: 0.016, change24h: 0.18, popular: true },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", rate: 0.011, change24h: -0.05, popular: true },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 0.087, change24h: 0.09, popular: false },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rate: 0.016, change24h: 0.14, popular: false },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", rate: 0.094, change24h: 0.11, popular: false },
    { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿", rate: 0.02, change24h: 0.25, popular: false },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪", rate: 0.13, change24h: -0.18, popular: false },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴", rate: 0.13, change24h: -0.22, popular: false },
    { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰", rate: 0.082, change24h: -0.09, popular: false },
    { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱", rate: 0.049, change24h: 0.16, popular: false },
    { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿", rate: 0.28, change24h: 0.12, popular: false },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺", rate: 4.35, change24h: -0.31, popular: false },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺", rate: 1.12, change24h: -0.45, popular: false },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rate: 0.061, change24h: 0.28, popular: false },
    { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽", rate: 0.21, change24h: 0.19, popular: false },
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦", rate: 0.22, change24h: 0.33, popular: false },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷", rate: 16.2, change24h: -0.07, popular: false },
    { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rate: 0.43, change24h: 0.21, popular: false },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", rate: 0.056, change24h: 0.15, popular: false },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", rate: 188.5, change24h: -0.18, popular: false },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭", rate: 0.68, change24h: 0.24, popular: false },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳", rate: 295.8, change24h: 0.08, popular: false },
  ]

  useEffect(() => {
    const saved = localStorage.getItem("selected_currency")
    if (saved) {
      setSelectedCurrency(saved)
    }
  }, [])

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !showPopularOnly || currency.popular
    return matchesSearch && matchesFilter
  })

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode)
    localStorage.setItem("selected_currency", currencyCode)
    toast.success(`Currency changed to ${currencyCode}`)
  }

  const formatRate = (rate: number, fromCurrency: string) => {
    if (fromCurrency === "INR") {
      return rate.toFixed(rate < 1 ? 4 : 2)
    }
    return (1 / rate).toFixed(0)
  }

  const popularCurrencies = currencies.filter((c) => c.popular)
  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <div className="glass-white border-b border-orange-200/50 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold gradient-text">Currency Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Current Selection */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text">Current Currency</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCurrencyData && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedCurrencyData.flag}</span>
                  <div>
                    <p className="font-medium text-orange-900">{selectedCurrencyData.name}</p>
                    <p className="text-sm text-orange-700">
                      {selectedCurrencyData.code} ({selectedCurrencyData.symbol})
                    </p>
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-600" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exchange Rate Info */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">Exchange Rates</CardTitle>
              <Button variant="ghost" size="sm" onClick={refreshRates} disabled={loading} className="text-orange-600">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {popularCurrencies.slice(0, 4).map((currency) => (
                <div key={currency.code} className="p-3 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-orange-900">
                      {currency.flag} {currency.code}
                    </span>
                    <div
                      className={`flex items-center text-xs ${
                        currency.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {currency.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(currency.change24h)}%
                    </div>
                  </div>
                  <p className="text-sm text-orange-700">
                    1 INR = {formatRate(currency.rate, "INR")} {currency.symbol}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="glass-white border-orange-200/50">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search currencies..."
                className="pl-10"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-700">Show popular only</span>
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className={showPopularOnly ? "bg-gradient-to-r from-orange-500 to-yellow-500" : ""}
              >
                {showPopularOnly ? "Popular" : "All"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Currencies */}
        {!searchQuery && !showPopularOnly && (
          <Card className="glass-white border-orange-200/50">
            <CardHeader>
              <CardTitle className="gradient-text">Popular Currencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {popularCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant={selectedCurrency === currency.code ? "default" : "outline"}
                    className={`h-auto p-3 justify-start ${
                      selectedCurrency === currency.code
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleCurrencySelect(currency.code)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{currency.flag}</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">{currency.code}</p>
                        <p className="text-xs opacity-70">{currency.symbol}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Currencies */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">
                {searchQuery ? `Search Results (${filteredCurrencies.length})` : "All Currencies"}
              </CardTitle>
              {!searchQuery && <Badge variant="secondary">{filteredCurrencies.length}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCurrency === currency.code
                      ? "bg-orange-100 border-2 border-orange-300"
                      : "bg-orange-50 hover:bg-orange-100 border-2 border-transparent"
                  }`}
                  onClick={() => handleCurrencySelect(currency.code)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{currency.flag}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-orange-900">{currency.code}</p>
                        {currency.popular && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Popular</Badge>}
                      </div>
                      <p className="text-sm text-orange-700">{currency.name}</p>
                      <p className="text-xs text-orange-600">
                        1 INR = {formatRate(currency.rate, "INR")} {currency.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center text-xs ${
                        currency.change24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {currency.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(currency.change24h)}%
                    </div>
                    {selectedCurrency === currency.code && <Check className="w-5 h-5 text-green-600" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Currency Converter */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text">Quick Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-orange-800">Amount</label>
                  <Input type="number" placeholder="100" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-800">From</label>
                  <div className="mt-1 p-2 border border-orange-200 rounded-lg bg-orange-50">
                    <span className="text-sm text-orange-900">INR (₹)</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                  <RefreshCw className="w-4 h-4 text-orange-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-orange-800">Result</label>
                  <div className="mt-1 p-2 border border-orange-200 rounded-lg bg-green-50">
                    <span className="text-sm text-green-900">
                      {selectedCurrencyData &&
                        `${formatRate(selectedCurrencyData.rate * 100, "INR")} ${selectedCurrencyData.symbol}`}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-orange-800">To</label>
                  <div className="mt-1 p-2 border border-orange-200 rounded-lg bg-orange-50">
                    <span className="text-sm text-orange-900">
                      {selectedCurrencyData && `${selectedCurrency} (${selectedCurrencyData.symbol})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
