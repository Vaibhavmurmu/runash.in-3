"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Settings = {
  rate: number
  pitch: number
  volume: number
  autoSpeak: boolean
  voice?: SpeechSynthesisVoice | null
}

interface Props {
  settings: Settings
  availableVoices?: SpeechSynthesisVoice[]
  onSave: (s: Settings) => void
  onClose: () => void
  ttsService?: any
}

export default function VoiceSettingsDialog({ settings, availableVoices = [], onSave, onClose }: Props) {
  const [rate, setRate] = useState(settings.rate ?? 1)
  const [pitch, setPitch] = useState(settings.pitch ?? 1)
  const [volume, setVolume] = useState(settings.volume ?? 0.8)
  const [autoSpeak, setAutoSpeak] = useState(settings.autoSpeak ?? true)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(settings.voice ?? null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="z-10 w-full max-w-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Voice Settings</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Voice</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={voice?.voiceURI || voice?.name || ""}
              onChange={(e) => {
                const val = e.target.value
                const v = availableVoices.find((vv) => vv.voiceURI === val || vv.name === val) || null
                setVoice(v)
              }}
            >
              {availableVoices.length === 0 && <option value="">Default</option>}
              {availableVoices.map((v) => (
                <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Rate: {rate.toFixed(1)}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Pitch: {pitch.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Volume: {volume.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input id="autospeak" type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
            <label htmlFor="autospeak" className="text-sm">
              Auto speak AI responses
            </label>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSave({
                  rate,
                  pitch,
                  volume,
                  autoSpeak,
                  voice,
                })
              }
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
    }
