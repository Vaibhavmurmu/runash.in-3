// Simple TTS service wrapper around window.speechSynthesis
// Methods: isSupported(), getVoices(), speak(text, settings, onEnd, onError), stop()

type TTSSettings = {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  autoSpeak?: boolean
}

export class TextToSpeechService {
  private utterances: SpeechSynthesisUtterance[] = []

  isSupported() {
    return typeof window !== "undefined" && !!window.speechSynthesis
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported()) return []
    return window.speechSynthesis.getVoices() || []
  }

  speak(text: string, settings: TTSSettings = {}, onEnd?: () => void, onError?: (e: any) => void) {
    if (!this.isSupported()) {
      if (onError) onError(new Error("TTS not supported"))
      return
    }

    const utter = new SpeechSynthesisUtterance(text)
    if (settings.voice) utter.voice = settings.voice
    if (typeof settings.rate === "number") utter.rate = settings.rate
    if (typeof settings.pitch === "number") utter.pitch = settings.pitch
    if (typeof settings.volume === "number") utter.volume = settings.volume

    utter.onend = () => {
      this.utterances = this.utterances.filter((u) => u !== utter)
      if (onEnd) onEnd()
    }
    utter.onerror = (e) => {
      this.utterances = this.utterances.filter((u) => u !== utter)
      if (onError) onError(e)
    }

    this.utterances.push(utter)
    try {
      window.speechSynthesis.speak(utter)
    } catch (e) {
      if (onError) onError(e)
    }
  }

  stop() {
    if (!this.isSupported()) return
    try {
      window.speechSynthesis.cancel()
    } catch (e) {
      // ignore
    } finally {
      this.utterances = []
    }
  }
        }
