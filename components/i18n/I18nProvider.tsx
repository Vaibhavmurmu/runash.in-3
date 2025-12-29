"use client"

import React, { createContext, useContext, useMemo } from "react"

const translations: Record<string, Record<string, string>> = {
  en: {
    heroTitle: "The AI Live Streaming Platform",
    heroSubtitle: "The next generation of AI live streaming platform for creators, sellers, and businesses",
    startStreaming: "Start Streaming",
    watchDemo: "Watch Demo",
    plansTitle: "Choose Your Plan",
    freeTrial: "Start Your Free Trial",
  },
  hi: {
    heroTitle: "AI लाइव स्ट्रीमिंग प्लेटफ़ॉर्म",
    heroSubtitle: "क्रिएटर्स, विक्रेताओं और व्यवसायों के लिए अगली पीढ़ी का AI स्ट्रीमिंग प्लेटफ़ॉर्म",
    startStreaming: "स्ट्रीम शुरू करें",
    watchDemo: "डेमो देखें",
    plansTitle: "अपनी योजना चुनें",
    freeTrial: "निशुल्क परीक्षण शुरू करें",
   },
  }


const I18nContext = createContext({ locale: "en", t: (k: string) => k })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = typeof navigator !== "undefined" ? navigator.language : "en"
  const preferred = locale.split("-")[0]
  const lang = translations[preferred] ? preferred : "en"
  const t = (key: string) => translations[lang][key] || translations["en"][key] || key
  const value = useMemo(() => ({ locale: lang, t }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
