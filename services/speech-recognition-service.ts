// Minimal wrapper for Web Speech API (SpeechRecognition)
// Exposes: isSupported(), startListening(onResult, onError), stopListening()

type RecognitionResult = { transcript: string; isFinal: boolean }

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null
  private active = false

  constructor() {
    const win = typeof window !== "undefined" ? window : (globalThis as any)
    const Rec = (win as any).SpeechRecognition || (win as any).webkitSpeechRecognition
    if (!Rec) {
      this.recognition = null
      return
    }

    this.recognition = new Rec()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"
  }

  isSupported() {
    return !!this.recognition
  }

  startListening(onResult: (r: RecognitionResult) => void, onError?: (e: any) => void) {
    if (!this.recognition) throw new Error("SpeechRecognition not supported")

    if (this.active) {
      // already listening
      return
    }

    this.recognition.onresult = (ev: SpeechRecognitionEvent) => {
      try {
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i]
          const transcript = Array.from(res).map((r: any) => r.transcript).join("")
          const isFinal = res.isFinal
          onResult({ transcript, isFinal })
        }
      } catch (e) {
        console.error("Recognition onresult error", e)
      }
    }

    this.recognition.onerror = (ev: any) => {
      if (onError) onError(ev)
    }

    try {
      this.recognition.start()
      this.active = true
    } catch (e) {
      // Some browsers throw if start called too quickly; surface to caller
      if (onError) onError(e)
      throw e
    }
  }

  stopListening() {
    if (!this.recognition) return
    try {
      this.recognition.onresult = null
      this.recognition.onerror = null
      this.recognition.stop()
    } catch (e) {
      // ignore
    } finally {
      this.active = false
    }
  }
      }
