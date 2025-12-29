import { BackgroundSync } from "./background-sync" // Assuming BackgroundSync is in a separate file

export interface RecordingData {
  id: string
  title: string
  description?: string
  duration: number
  fileSize: number
  thumbnailUrl?: string
  recordingUrl?: string
  playbackUrl?: string
  status: "scheduled" | "recording" | "processing" | "completed" | "failed"
  quality: string
  createdAt: string
  updatedAt: string
  userId: string
  tags: string[]
  isPublic: boolean
  isProcessing: boolean
  viewCount: number
  streamId?: string
}

export interface CreateRecordingData {
  title: string
  description?: string
  streamId?: string
  duration?: number
  quality?: string
}

export interface UpdateRecordingData {
  title?: string
  description?: string
  tags?: string[]
  isPublic?: boolean
  thumbnailUrl?: string
}

export class RecordingService {
  private static instance: RecordingService
  private recordingListeners: ((recordings: RecordingData[]) => void)[] = []
  private backgroundSync: BackgroundSync

  private constructor() {
    this.backgroundSync = BackgroundSync.getInstance()
  }

  public static getInstance(): RecordingService {
    if (!RecordingService.instance) {
      RecordingService.instance = new RecordingService()
    }
    return RecordingService.instance
  }

  // Create new recording
  public async createRecording(data: CreateRecordingData): Promise<RecordingData> {
    try {
      const response = await fetch("/api/recordings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create recording")
      }

      const { recording } = await response.json()

      this.backgroundSync.addToSyncQueue({
        type: "recording",
        action: "create",
        data: recording,
      })

      this.notifyRecordingListeners()
      return recording
    } catch (error) {
      console.error("Failed to create recording:", error)
      throw error
    }
  }

  // Get all user recordings
  public async getUserRecordings(): Promise<RecordingData[]> {
    try {
      const response = await fetch("/api/recordings")
      if (!response.ok) {
        throw new Error("Failed to fetch recordings")
      }

      const { recordings } = await response.json()
      return recordings
    } catch (error) {
      console.error("Failed to fetch recordings:", error)
      return []
    }
  }

  // Get recordings for specific stream
  public async getStreamRecordings(streamId: string): Promise<RecordingData[]> {
    try {
      const response = await fetch(`/api/recordings?streamId=${streamId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch stream recordings")
      }

      const { recordings } = await response.json()
      return recordings
    } catch (error) {
      console.error("Failed to fetch stream recordings:", error)
      return []
    }
  }

  // Get single recording
  public async getRecording(id: string): Promise<RecordingData | null> {
    try {
      const response = await fetch(`/api/recordings/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error("Failed to fetch recording")
      }

      const { recording } = await response.json()
      return recording
    } catch (error) {
      console.error("Failed to fetch recording:", error)
      return null
    }
  }

  // Update recording
  public async updateRecording(id: string, data: UpdateRecordingData): Promise<RecordingData> {
    try {
      const response = await fetch(`/api/recordings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update recording")
      }

      const { recording } = await response.json()

      this.backgroundSync.addToSyncQueue({
        type: "recording",
        action: "update",
        data: recording,
      })

      this.notifyRecordingListeners()
      return recording
    } catch (error) {
      console.error("Failed to update recording:", error)
      throw error
    }
  }

  // Delete recording
  public async deleteRecording(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/recordings/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete recording")
      }

      this.notifyRecordingListeners()
    } catch (error) {
      console.error("Failed to delete recording:", error)
      throw error
    }
  }

  // Upload recording file
  public async uploadRecording(
    streamId: string,
    file: File,
    duration: number,
    onProgress?: (progress: number) => void,
  ): Promise<RecordingData> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("streamId", streamId)
      formData.append("duration", duration.toString())

      const response = await fetch("/api/recordings/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload recording")
      }

      const { recording } = await response.json()
      this.notifyRecordingListeners()
      return recording
    } catch (error) {
      console.error("Failed to upload recording:", error)
      throw error
    }
  }

  // Start recording for a stream
  public async startRecording(streamId: string, title: string): Promise<RecordingData> {
    const recording = await this.createRecording({
      title,
      streamId,
      quality: "1080p",
    })

    // Update status to recording
    return await this.updateRecording(recording.id, { title })
  }

  // Stop recording
  public async stopRecording(recordingId: string, duration: number): Promise<RecordingData> {
    return await this.updateRecording(recordingId, {})
  }

  // Event listeners
  public onRecordingsChange(callback: (recordings: RecordingData[]) => void): () => void {
    this.recordingListeners.push(callback)
    return () => {
      this.recordingListeners = this.recordingListeners.filter((cb) => cb !== callback)
    }
  }

  private notifyRecordingListeners(): void {
    // Fetch updated recordings and notify listeners
    this.getUserRecordings().then((recordings) => {
      this.recordingListeners.forEach((listener) => listener(recordings))
    })
  }
}
