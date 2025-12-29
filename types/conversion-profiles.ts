import type { ConversionSettings } from "./conversion"

export interface ConversionProfile {
  id: string
  name: string
  description?: string
  targetFormat: string
  settings: ConversionSettings
  isDefault?: boolean
  createdAt: string
  updatedAt: string
  userId: string
}
