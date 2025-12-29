import { useEffect, useRef, useState } from "react"

// Hook that provides minimal recording indicators: isRecording, audioLevel (0..1), duration (seconds)
// startRecording() attempts to get microphone and creates an AudioContext/Analyser to compute level.
// stopRecording() stops tracks and cleans up.

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [duration, setDuration] = useState(0)

  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTsRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      // cleanup if component unmounts
      stopRecordingInternal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopRecordingInternal = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close()
      } catch (e) {
        // ignore
      }
      audioCtxRef.current = null
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop())
      mediaStreamRef.current = null
    }
    startTsRef.current = null
    setIsRecording(false)
    setAudioLevel(0)
    setDuration(0)
  }

  const updateLevel = () => {
    try {
      const analyser = analyserRef.current
      if (!analyser) return
      const bufferLength = analyser.frequencyBinCount
      const data = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(data)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += data[i]
      }
      const avg = sum / bufferLength
      const norm = Math.min(1, avg / 128) // 0..1
      setAudioLevel(norm)
      if (startTsRef.current) {
        const sec = Math.floor((Date.now() - startTsRef.current) / 1000)
        setDuration(sec)
      }
    } catch (e) {
      // ignore analysis errors
    } finally {
      rafRef.current = requestAnimationFrame(updateLevel)
    }
  }

  const startRecording = async () => {
    if (isRecording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser
      startTsRef.current = Date.now()
      setIsRecording(true)
      updateLevel()
    } catch (e) {
      console.warn("Unable to start recording", e)
    }
  }

  const stopRecording = () => {
    stopRecordingInternal()
  }

  return {
    isRecording,
    audioLevel,
    duration,
    startRecording,
    stopRecording,
  }
    }
