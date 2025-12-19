"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, TrendingUp, RefreshCw, Loader2 } from "lucide-react"
import { useCurrencyConverter } from "@/lib/hooks/use-exchange-rates"
import { toast } from "sonner"

interface CurrencyConverterProps {
  defaultFromCurrency?: string
  defaultToCurrency?: string
  defaultAmount?: number
}

export function CurrencyConverter({
  defaultFromCurrency = "USD",
  defaultToCurrency = "INR",
  defaultAmount = 100,
}: CurrencyConverterProps) {
  const [mounted, setMounted] = useState(false)
  const [amount, setAmount] = useState(defaultAmount.toString())
  const [fromCurrency, setFromCurrency] = useState(defaultFromCurrency)
  const [toCurrency, setToCurrency] = useState(defaultToCurrency)
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const { convertCurrency, formatCurrency, getCurrencySymbol, getSupportedCurrencies, converting, error } =
    useCurrencyConverter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && amount && fromCurrency && toCurrency) {
      handleConvert()
    }
  }, [amount, fromCurrency, toCurrency, mounted])

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount))) {
      setConvertedAmount(null)
      setExchangeRate(null)
      return
    }

    try {
      const result = await convertCurrency(Number(amount), fromCurrency, toCurrency)
      setConvertedAmount(result.convertedAmount)
      setExchangeRate(result.exchangeRate)
      setLastUpdated(new Date())
    } catch (err) {
      toast.error("Failed to convert currency")
      setConvertedAmount(null)
      setExchangeRate(null)
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleRefresh = () => {
    handleConvert()
    toast.success("Exchange rates refreshed")
  }

  if (!mounted) {
    return (
      <Card className="glass-white border-orange-200/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-orange-200 rounded w-1/4"></div>
            <div className="h-10 bg-orange-200 rounded"></div>
            <div className="h-10 bg-orange-200 rounded"></div>
            <div className="h-8 bg-orange-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const supportedCurrencies = getSupportedCurrencies()

  return (
    <Card className="glass-white border-orange-200/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="gradient-text flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Currency Converter</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={converting}
            className="text-orange-600 hover:text-orange-700"
          >
            <RefreshCw className={`w-4 h-4 ${converting ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border-orange-200 focus:border-orange-400"
            min="0"
            step="0.01"
          />
        </div>

        {/* From Currency */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger className="border-orange-200 focus:border-orange-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{getCurrencySymbol(currency)}</span>
                    <span>{currency}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSwapCurrencies}
            className="rounded-full border-orange-200 hover:bg-orange-50 bg-transparent"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger className="border-orange-200 focus:border-orange-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{getCurrencySymbol(currency)}</span>
                    <span>{currency}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Result */}
        {converting ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="ml-2 text-orange-600">Converting...</span>
          </div>
        ) : convertedAmount !== null ? (
          <div className="bg-orange-50 rounded-lg p-4 space-y-3">
            <div className="text-center">
              <p className="text-sm text-orange-600 mb-1">Converted Amount</p>
              <p className="text-2xl font-bold gradient-text">{formatCurrency(convertedAmount, toCurrency)}</p>
            </div>

            {exchangeRate && (
              <div className="text-center text-sm text-orange-700">
                <p>
                  1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                </p>
                {lastUpdated && (
                  <p className="text-xs text-orange-500 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
                )}
              </div>
            )}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : null}

        {/* Quick Convert Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {[100, 500, 1000].map((quickAmount) => (
            <Button
              key={quickAmount}
              variant="outline"
              size="sm"
              onClick={() => setAmount(quickAmount.toString())}
              className="border-orange-200 hover:bg-orange-50 text-orange-700"
            >
              {getCurrencySymbol(fromCurrency)}
              {quickAmount}
            </Button>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-orange-500 text-center">
          <p>Exchange rates are for reference only and may not reflect real-time market rates.</p>
        </div>
      </CardContent>
    </Card>
  )
  }
