export type AlertType = "follow" | "subscription" | "donation" | "cheer" | "host" | "raid" | "milestone" | "custom"

export type AlertAnimation = "fade" | "slide-in" | "bounce" | "pulse" | "shake" | "flip" | "zoom" | "custom"

export type AlertPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export interface AlertTemplate {
  id: string
  name: string
  type: AlertType
  message: string
  imageUrl?: string
  soundUrl?: string
  animation: AlertAnimation
  duration: number // in seconds
  position: AlertPosition
  enabled: boolean
  customCss?: string
  minAmount?: number // for donation/cheer alerts
  customVariables?: Record<string, string>
}

export interface AlertEvent {
  id: string
  type: AlertType
  username: string
  platform: string
  timestamp: string
  message?: string
  amount?: number
  tier?: string
  months?: number
  viewers?: number
  milestone?: string
  customData?: Record<string, any>
}

export interface AlertSettings {
  globalVolume: number
  queueAlerts: boolean
  alertDelay: number // in seconds
  alertsEnabled: boolean
  testMode: boolean
}
