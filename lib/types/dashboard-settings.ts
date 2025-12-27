export type DashboardSettings = {
  displayName?: string
  profileVisibility?: "public" | "private"
  defaultCategory?: string
  notifyOnFollower?: boolean
  notifyOnDonation?: boolean
  theme?: "system" | "light" | "dark"
  recordingEnabled?: boolean
  streamQuality?: "auto" | "720p" | "1080p"
  // add more fields as needed
  updatedAt?: string
}
