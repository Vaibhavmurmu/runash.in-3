"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations } from "./translations"

interface I18nContextType {
  currentLanguage: string
  setLanguage: (language: string) => void
  t: (key: string, params?: Record<string, string>) => string
  availableLanguages: string[]
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [availableLanguages, setAvailableLanguages] = useState(["en", "hi"])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load saved language preference
      const saved = localStorage.getItem("preferred_language")
      if (saved && availableLanguages.includes(saved)) {
        setCurrentLanguage(saved)
      } else {
        // Detect browser language
        const browserLang = navigator.language.split("-")[0]
        if (availableLanguages.includes(browserLang)) {
          setCurrentLanguage(browserLang)
        }
      }

      // Load available languages from storage
      const savedAvailable = localStorage.getItem("available_languages")
      if (savedAvailable) {
        try {
          const parsed = JSON.parse(savedAvailable)
          if (Array.isArray(parsed)) {
            setAvailableLanguages(parsed)
          }
        } catch (error) {
          console.error("Failed to parse available languages:", error)
        }
      }
    }
  }, [])

  const setLanguage = (language: string) => {
    setCurrentLanguage(language)
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_language", language)

      // Add to available languages if not already present
      if (!availableLanguages.includes(language)) {
        const updated = [...availableLanguages, language]
        setAvailableLanguages(updated)
        localStorage.setItem("available_languages", JSON.stringify(updated))
      }
    }
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".")
    let value: any = translations[currentLanguage as keyof typeof translations] || translations.en

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== "string") {
      // Fallback to English
      value = translations.en
      for (const k of keys) {
        value = value?.[k]
      }
    }

    if (typeof value !== "string") {
      return key // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, replacement]) => {
        value = value.replace(`{{${param}}}`, replacement)
      })
    }

    return value
  }

  const rtlLanguages = ["ar", "ur", "he", "fa"]
  const isRTL = rtlLanguages.includes(currentLanguage)

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        availableLanguages,
        isRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
