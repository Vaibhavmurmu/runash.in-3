"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Check, Globe, Download, Volume2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl: boolean
  popular: boolean
  downloadSize: string
  voiceSupport: boolean
  completion: number
}

export default function LanguageSelectorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [downloadingLanguages, setDownloadingLanguages] = useState<string[]>([])
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(["en", "hi"])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved language preference
    if (typeof window !== "undefined") {
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

  const languages: Language[] = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇺🇸",
      rtl: false,
      popular: true,
      downloadSize: "2.1 MB",
      voiceSupport: true,
      completion: 100,
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.8 MB",
      voiceSupport: true,
      completion: 95,
    },
    {
      code: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      flag: "🇧🇩",
      rtl: false,
      popular: true,
      downloadSize: "2.5 MB",
      voiceSupport: true,
      completion: 90,
    },
    {
      code: "te",
      name: "Telugu",
      nativeName: "తెలుగు",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.3 MB",
      voiceSupport: true,
      completion: 88,
    },
    {
      code: "mr",
      name: "Marathi",
      nativeName: "मराठी",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.2 MB",
      voiceSupport: true,
      completion: 85,
    },
    {
      code: "ta",
      name: "Tamil",
      nativeName: "தமிழ்",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.4 MB",
      voiceSupport: true,
      completion: 92,
    },
    {
      code: "gu",
      name: "Gujarati",
      nativeName: "ગુજરાતી",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.1 MB",
      voiceSupport: true,
      completion: 87,
    },
    {
      code: "kn",
      name: "Kannada",
      nativeName: "ಕನ್ನಡ",
      flag: "🇮🇳",
      rtl: false,
      popular: true,
      downloadSize: "2.3 MB",
      voiceSupport: true,
      completion: 83,
    },
    {
      code: "ml",
      name: "Malayalam",
      nativeName: "മലയാളം",
      flag: "🇮🇳",
      rtl: false,
      popular: false,
      downloadSize: "2.2 MB",
      voiceSupport: true,
      completion: 81,
    },
    {
      code: "pa",
      name: "Punjabi",
      nativeName: "ਪੰਜਾਬੀ",
      flag: "🇮🇳",
      rtl: false,
      popular: false,
      downloadSize: "2.0 MB",
      voiceSupport: true,
      completion: 79,
    },
    {
      code: "or",
      name: "Odia",
      nativeName: "ଓଡ଼ିଆ",
      flag: "🇮🇳",
      rtl: false,
      popular: false,
      downloadSize: "1.9 MB",
      voiceSupport: false,
      completion: 75,
    },
    {
      code: "as",
      name: "Assamese",
      nativeName: "অসমীয়া",
      flag: "🇮🇳",
      rtl: false,
      popular: false,
      downloadSize: "1.8 MB",
      voiceSupport: false,
      completion: 72,
    },
    {
      code: "ur",
      name: "Urdu",
      nativeName: "اردو",
      flag: "🇵🇰",
      rtl: true,
      popular: false,
      downloadSize: "2.6 MB",
      voiceSupport: true,
      completion: 86,
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      flag: "🇸🇦",
      rtl: true,
      popular: false,
      downloadSize: "3.1 MB",
      voiceSupport: true,
      completion: 94,
    },
    {
      code: "zh",
      name: "Chinese",
      nativeName: "中文",
      flag: "🇨🇳",
      rtl: false,
      popular: false,
      downloadSize: "3.5 MB",
      voiceSupport: true,
      completion: 96,
    },
    {
      code: "ja",
      name: "Japanese",
      nativeName: "日本語",
      flag: "🇯🇵",
      rtl: false,
      popular: false,
      downloadSize: "3.2 MB",
      voiceSupport: true,
      completion: 93,
    },
    {
      code: "ko",
      name: "Korean",
      nativeName: "한국어",
      flag: "🇰🇷",
      rtl: false,
      popular: false,
      downloadSize: "2.9 MB",
      voiceSupport: true,
      completion: 89,
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      flag: "🇪🇸",
      rtl: false,
      popular: false,
      downloadSize: "2.7 MB",
      voiceSupport: true,
      completion: 97,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      flag: "🇫🇷",
      rtl: false,
      popular: false,
      downloadSize: "2.8 MB",
      voiceSupport: true,
      completion: 95,
    },
    {
      code: "de",
      name: "German",
      nativeName: "Deutsch",
      flag: "🇩🇪",
      rtl: false,
      popular: false,
      downloadSize: "2.6 MB",
      voiceSupport: true,
      completion: 92,
    },
    {
      code: "it",
      name: "Italian",
      nativeName: "Italiano",
      flag: "🇮🇹",
      rtl: false,
      popular: false,
      downloadSize: "2.5 MB",
      voiceSupport: true,
      completion: 90,
    },
    {
      code: "pt",
      name: "Portuguese",
      nativeName: "Português",
      flag: "🇵🇹",
      rtl: false,
      popular: false,
      downloadSize: "2.4 MB",
      voiceSupport: true,
      completion: 88,
    },
    {
      code: "ru",
      name: "Russian",
      nativeName: "Русский",
      flag: "🇷🇺",
      rtl: false,
      popular: false,
      downloadSize: "3.0 MB",
      voiceSupport: true,
      completion: 91,
    },
    {
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      flag: "🇹🇷",
      rtl: false,
      popular: false,
      downloadSize: "2.3 MB",
      voiceSupport: true,
      completion: 84,
    },
    {
      code: "th",
      name: "Thai",
      nativeName: "ไทย",
      flag: "🇹🇭",
      rtl: false,
      popular: false,
      downloadSize: "2.7 MB",
      voiceSupport: true,
      completion: 82,
    },
    {
      code: "vi",
      name: "Vietnamese",
      nativeName: "Tiếng Việt",
      flag: "🇻🇳",
      rtl: false,
      popular: false,
      downloadSize: "2.4 MB",
      voiceSupport: true,
      completion: 80,
    },
    {
      code: "id",
      name: "Indonesian",
      nativeName: "Bahasa Indonesia",
      flag: "🇮🇩",
      rtl: false,
      popular: false,
      downloadSize: "2.2 MB",
      voiceSupport: true,
      completion: 78,
    },
    {
      code: "ms",
      name: "Malay",
      nativeName: "Bahasa Melayu",
      flag: "🇲🇾",
      rtl: false,
      popular: false,
      downloadSize: "2.1 MB",
      voiceSupport: true,
      completion: 76,
    },
  ]

  const filteredLanguages = languages.filter((language) => {
    const matchesSearch =
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = !showPopularOnly || language.popular
    return matchesSearch && matchesFilter
  })

  const handleLanguageSelect = async (languageCode: string) => {
    const language = languages.find((l) => l.code === languageCode)
    if (!language) return

    // Check if language needs to be downloaded
    if (!availableLanguages.includes(languageCode) && languageCode !== "en") {
      setDownloadingLanguages((prev) => [...prev, languageCode])

      try {
        // Simulate download
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success(`${language.name} language pack downloaded successfully!`)

        // Add to available languages
        const updatedAvailable = [...availableLanguages, languageCode]
        setAvailableLanguages(updatedAvailable)
        if (typeof window !== "undefined") {
          localStorage.setItem("available_languages", JSON.stringify(updatedAvailable))
        }
      } catch (error) {
        toast.error(`Failed to download ${language.name} language pack`)
        setDownloadingLanguages((prev) => prev.filter((l) => l !== languageCode))
        return
      } finally {
        setDownloadingLanguages((prev) => prev.filter((l) => l !== languageCode))
      }
    }

    setCurrentLanguage(languageCode)
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_language", languageCode)
    }
    toast.success(`Language changed to ${language.name}`)
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="glass-white border-b border-orange-200/50 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold gradient-text">Language Settings</h1>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-orange-100 rounded-lg"></div>
            <div className="h-24 bg-orange-100 rounded-lg"></div>
            <div className="h-48 bg-orange-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  const popularLanguages = languages.filter((l) => l.popular)
  const currentLanguageData = languages.find((l) => l.code === currentLanguage)

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
            <h1 className="text-xl font-semibold gradient-text">Language Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Current Language */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text">Current Language</CardTitle>
          </CardHeader>
          <CardContent>
            {currentLanguageData && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{currentLanguageData.flag}</span>
                  <div>
                    <p className="font-medium text-orange-900">{currentLanguageData.name}</p>
                    <p className="text-sm text-orange-700">{currentLanguageData.nativeName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {currentLanguageData.completion}% Complete
                      </Badge>
                      {currentLanguageData.voiceSupport && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Voice
                        </Badge>
                      )}
                      {currentLanguageData.rtl && <Badge className="bg-purple-100 text-purple-800 text-xs">RTL</Badge>}
                    </div>
                  </div>
                </div>
                <Check className="w-5 h-5 text-green-600" />
              </div>
            )}
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
                placeholder="Search languages..."
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

        {/* Popular Languages */}
        {!searchQuery && !showPopularOnly && (
          <Card className="glass-white border-orange-200/50">
            <CardHeader>
              <CardTitle className="gradient-text">Popular in India</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {popularLanguages.slice(0, 6).map((language) => (
                  <Button
                    key={language.code}
                    variant={currentLanguage === language.code ? "default" : "outline"}
                    className={`h-auto p-3 justify-start ${
                      currentLanguage === language.code
                        ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                    disabled={downloadingLanguages.includes(language.code)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{language.flag}</span>
                      <div className="text-left">
                        <p className="font-medium text-sm">{language.name}</p>
                        <p className="text-xs opacity-70">{language.nativeName}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Languages */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">
                {searchQuery ? `Search Results (${filteredLanguages.length})` : "All Languages"}
              </CardTitle>
              {!searchQuery && <Badge variant="secondary">{filteredLanguages.length}</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredLanguages.map((language) => {
                const isDownloading = downloadingLanguages.includes(language.code)
                const isDownloaded = availableLanguages.includes(language.code) || language.code === "en"

                return (
                  <div
                    key={language.code}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentLanguage === language.code
                        ? "bg-orange-100 border-2 border-orange-300"
                        : "bg-orange-50 hover:bg-orange-100 border-2 border-transparent"
                    }`}
                    onClick={() => !isDownloading && handleLanguageSelect(language.code)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{language.flag}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-orange-900">{language.name}</p>
                          {language.popular && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Popular</Badge>}
                          {language.rtl && <Badge className="bg-purple-100 text-purple-800 text-xs">RTL</Badge>}
                        </div>
                        <p className="text-sm text-orange-700">{language.nativeName}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-orange-600">{language.completion}% complete</span>
                          {language.voiceSupport && <Volume2 className="w-3 h-3 text-blue-600" />}
                          {!isDownloaded && <span className="text-xs text-orange-500">{language.downloadSize}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isDownloading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-orange-600">Downloading...</span>
                        </div>
                      ) : !isDownloaded ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLanguageSelect(language.code)
                          }}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      ) : currentLanguage === language.code ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

                {/* Language Features */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-orange-900">Voice Support</p>
                    <p className="text-sm text-orange-700">Text-to-speech and voice commands</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {languages.filter((l) => l.voiceSupport).length} languages
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">RTL</span>
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">Right-to-Left Support</p>
                    <p className="text-sm text-orange-700">Arabic and Urdu script support</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  {languages.filter((l) => l.rtl).length} languages
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-orange-900">Offline Support</p>
                    <p className="text-sm text-orange-700">Download languages for offline use</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Management */}
        <Card className="glass-white border-orange-200/50">
          <CardHeader>
            <CardTitle className="gradient-text">Downloaded Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableLanguages.map((langCode) => {
                const language = languages.find((l) => l.code === langCode)
                if (!language) return null

                return (
                  <div
                    key={langCode}
                    className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <p className="font-medium text-green-900">{language.name}</p>
                        <p className="text-sm text-green-700">{language.downloadSize}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      {langCode !== "en" && langCode !== currentLanguage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Remove from available languages (simulate deletion)
                            const updated = availableLanguages.filter((l) => l !== langCode)
                            setAvailableLanguages(updated)
                            if (typeof window !== "undefined") {
                              localStorage.setItem("available_languages", JSON.stringify(updated))
                            }
                            toast.success(`${language.name} language pack removed`)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
