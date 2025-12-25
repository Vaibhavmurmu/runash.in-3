"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Volume2, AlertTriangle } from "lucide-react"
import type { TextToSpeechService } from "@/services/text-to-speech-service"

interface VoiceSettings {
  rate: number
  pitch: number
  volume: number
  autoSpeak: boolean
  // We store the selected voice by name/lang so it survives serialization.
  voice: SpeechSynthesisVoice | null
}

interface PersistableVoiceSettings {
  rate: number
  pitch: number
  volume: number
  autoSpeak: boolean
  voiceName?: string
  voiceLang?: string
}

interface VoiceSettingsDialogProps {
  settings: VoiceSettings
  onSave: (settings: VoiceSettings) => void
  onClose: () => void
  ttsService: TextToSpeechService | null
}

const LOCAL_STORAGE_KEY = "runash.voiceSettings"

export default function VoiceSettingsDialog({ settings, onSave, onClose, ttsService }: VoiceSettingsDialogProps) {
  // local settings mirror the incoming settings and are editable in the dialog
  const [localSettings, setLocalSettings] = useState<VoiceSettings>(() => ({
    rate: 1,
    pitch: 1,
    volume: 1,
    autoSpeak: false,
    voice: null,
    ...settings,
  }))

  // list of available voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  // whether TTS is available in the current environment
  const isNativeSupported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function"
  const isSupported = ttsService?.isSupported ? ttsService.isSupported() : isNativeSupported

  // Keep localSettings in sync if parent passes new settings
  useEffect(() => {
    setLocalSettings((prev) => ({ ...prev, ...settings }))
  }, [settings])

  // Load voices from the provided ttsService if present, otherwise use window.speechSynthesis
  const loadVoices = useCallback(() => {
    try {
      if (ttsService) {
        const available = ttsService.getVoices() || []
        setVoices(available)
        return available
      }

      if (typeof window !== "undefined" && window.speechSynthesis) {
        const available = window.speechSynthesis.getVoices() || []
        setVoices(available)
        return available
      }
    } catch (e) {
      // ignore and leave voices empty
      console.warn("Failed to load voices", e)
    }
    return []
  }, [ttsService])

  // Initial load + voiceschanged listener (for browsers that populate asynchronously)
  useEffect(() => {
    const available = loadVoices()

    // If no voice is selected, try to pick a sensible default (first English voice or first available)
    if (!localSettings.voice && available.length > 0) {
      const englishVoice = available.find((v) => v.lang && v.lang.startsWith("en")) || available[0]
      setLocalSettings((prev) => ({ ...prev, voice: englishVoice }))
    }

    // For browsers that fire the voiceschanged event (Chrome), attach listener
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const handler = () => {
        const updated = loadVoices()
        if (!localSettings.voice && updated.length > 0) {
          const englishVoice = updated.find((v) => v.lang && v.lang.startsWith("en")) || updated[0]
          setLocalSettings((prev) => ({ ...prev, voice: englishVoice }))
        }
      }
      window.speechSynthesis.addEventListener("voiceschanged", handler)
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", handler)
      }
    }
  }, [loadVoices, localSettings.voice])

  // Persist to localStorage when localSettings change (so closing/reopening dialog preserves last-used)
  useEffect(() => {
    try {
      const persist: PersistableVoiceSettings = {
        rate: localSettings.rate,
        pitch: localSettings.pitch,
        volume: localSettings.volume,
        autoSpeak: localSettings.autoSpeak,
        voiceName: localSettings.voice?.name,
        voiceLang: localSettings.voice?.lang,
      }
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persist))
    } catch (e) {
      // ignore storage errors (e.g., private mode)
    }
  }, [localSettings])

  // On mount, try to hydrate persisted settings if user hasn't provided explicit ones
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (raw) {
        const parsed: PersistableVoiceSettings = JSON.parse(raw)
        setLocalSettings((prev) => {
          // If we already have a voice object from ttsService/SS, try to resolve the persisted voice name/lang to that object
          let resolvedVoice: SpeechSynthesisVoice | null = prev.voice
          if (voices.length > 0 && parsed.voiceName) {
            const found = voices.find((v) => v.name === parsed.voiceName && (!parsed.voiceLang || v.lang === parsed.voiceLang))
            resolvedVoice = found || resolvedVoice
          }
          return {
            rate: parsed.rate ?? prev.rate,
            pitch: parsed.pitch ?? prev.pitch,
            volume: parsed.volume ?? prev.volume,
            autoSpeak: parsed.autoSpeak ?? prev.autoSpeak,
            voice: resolvedVoice,
          }
        })
      }
    } catch (e) {
      // ignore JSON parse/localStorage errors
    }
    // We only want this to run once on mount; voices may populate later and will be reconciled above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTestVoice = async () => {
    if (!isSupported) return

    const utteranceText = "This is a test of your voice settings for RunAsh Chat AI assistant."

    if (ttsService) {
      // Prefer using provided text-to-speech service if available
      try {
        await ttsService.speak(utteranceText, localSettings)
      } catch (e) {
        console.error("ttsService.speak failed:", e)
      }
      return
    }

    // Fallback to browser SpeechSynthesis
    try {
      if (typeof window === "undefined") return

      const utter = new SpeechSynthesisUtterance(utteranceText)
      if (localSettings.voice) utter.voice = localSettings.voice
      utter.rate = localSettings.rate
      utter.pitch = localSettings.pitch
      utter.volume = localSettings.volume

      // Cancel any ongoing speech and speak new utterance
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utter)
    } catch (e) {
      console.error("Fallback speak failed", e)
    }
  }

  // Save handler: call onSave (prop), persist to backend if an endpoint is available (best-effort)
  const handleSave = async () => {
    onSave(localSettings)

    // Best-effort backend persist. If your backend doesn't have this endpoint it will fail silently.
    try {
      await fetch("/api/voice-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: localSettings.rate,
          pitch: localSettings.pitch,
          volume: localSettings.volume,
          autoSpeak: localSettings.autoSpeak,
          voiceName: localSettings.voice?.name ?? null,
          voiceLang: localSettings.voice?.lang ?? null,
        }),
      }).catch(() => {
        /* ignore network errors */
      })
    } catch {
      // ignore
    }

    onClose()
  }

  // When user chooses a voice name in the UI, resolve voice object from voices list
  const handleSelectVoiceByName = (name: string) => {
    const selected = voices.find((v) => v.name === name) ?? null
    setLocalSettings((prev) => ({ ...prev, voice: selected }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Voice Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {!isSupported && (
            <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-50 border border-yellow-100 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <div>
                Text-to-speech is not supported in this browser. You can still save settings but testing audio is disabled.
              </div>
            </div>
          )}

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label>Voice</Label>
            <Select
              value={localSettings.voice?.name || ""}
              onValueChange={(value) => handleSelectVoiceByName(value)}
              disabled={!isSupported || voices.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={voices.length > 0 ? "Select a voice" : "No voices available"} />
              </SelectTrigger>
              <SelectContent>
                {voices.length === 0 && <SelectItem value="">No available voices</SelectItem>}
                {voices.map((voice) => (
                  <SelectItem key={`${voice.name}:${voice.lang}`} value={voice.name}>
                    {voice.name} ({voice.lang}) {voice.default ? "— default" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {localSettings.voice && (
              <p className="text-sm text-muted-foreground">
                Selected voice: {localSettings.voice.name} — {localSettings.voice.lang} {localSettings.voice.default ? "(default)" : ""}
              </p>
            )}
          </div>

          {/* Speech Rate */}
          <div className="space-y-2">
            <Label>Speech Rate: {localSettings.rate.toFixed(1)}x</Label>
            <Slider
              value={[localSettings.rate]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, rate: value }))}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
              disabled={!isSupported}
            />
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <Label>Pitch: {localSettings.pitch.toFixed(1)}</Label>
            <Slider
              value={[localSettings.pitch]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, pitch: value }))}
              min={0.5}
              max={2}
              step={0.1}
              className="w-full"
              disabled={!isSupported}
            />
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label>Volume: {Math.round(localSettings.volume * 100)}%</Label>
            <Slider
              value={[localSettings.volume]}
              onValueChange={([value]) => setLocalSettings((prev) => ({ ...prev, volume: value }))}
              min={0}
              max={1}
              step={0.05}
              className="w-full"
              disabled={!isSupported}
            />
          </div>

          {/* Auto Speak */}
          <div className="flex items-center justify-between">
            <Label>Auto-speak AI responses</Label>
            <Switch
              checked={localSettings.autoSpeak}
              onCheckedChange={(checked) => setLocalSettings((prev) => ({ ...prev, autoSpeak: checked }))}
            />
          </div>

          {/* Test Voice */}
          <Button variant="outline" onClick={handleTestVoice} className="w-full" disabled={!isSupported}>
            <Volume2 className="h-4 w-4 mr-2" />
            Test Voice
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
        </div>
      </Card>
    </div>
  )
}
