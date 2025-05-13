import type { ConversionProfile } from "@/types/conversion-profiles"

// In a real app, this would be stored in a database
let profiles: ConversionProfile[] = [
  {
    id: "profile-1",
    name: "YouTube 1080p",
    description: "Optimized for YouTube uploads at 1080p",
    targetFormat: "mp4",
    settings: {
      resolution: { width: 1920, height: 1080 },
      videoBitrate: 8000,
      framerate: 30,
      videoCodec: "h264",
      audioBitrate: 192,
      audioCodec: "aac",
      sampleRate: 48000,
      channels: 2,
      quality: 90,
      preserveMetadata: true,
    },
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
  {
    id: "profile-2",
    name: "Instagram Story",
    description: "Vertical video optimized for Instagram stories",
    targetFormat: "mp4",
    settings: {
      resolution: { width: 1080, height: 1920 },
      videoBitrate: 3500,
      framerate: 30,
      videoCodec: "h264",
      audioBitrate: 128,
      audioCodec: "aac",
      sampleRate: 44100,
      channels: 2,
      quality: 85,
      preserveMetadata: true,
    },
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
  {
    id: "profile-3",
    name: "Podcast Audio",
    description: "High quality audio for podcasts",
    targetFormat: "mp3",
    settings: {
      audioBitrate: 192,
      audioCodec: "mp3",
      sampleRate: 44100,
      channels: 2,
      quality: 90,
      preserveMetadata: true,
    },
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "user-1",
  },
]

// Get all profiles for a user
export const getUserProfiles = (userId: string): ConversionProfile[] => {
  return profiles.filter((profile) => profile.userId === userId)
}

// Get a profile by ID
export const getProfileById = (profileId: string): ConversionProfile | undefined => {
  return profiles.find((profile) => profile.id === profileId)
}

// Get the default profile for a user
export const getDefaultProfile = (userId: string): ConversionProfile | undefined => {
  return profiles.find((profile) => profile.userId === userId && profile.isDefault)
}

// Create a new profile
export const createProfile = (
  profile: Omit<ConversionProfile, "id" | "createdAt" | "updatedAt">,
): ConversionProfile => {
  const newProfile: ConversionProfile = {
    ...profile,
    id: `profile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // If this is set as default, unset any other defaults
  if (newProfile.isDefault) {
    profiles = profiles.map((p) => (p.userId === newProfile.userId ? { ...p, isDefault: false } : p))
  }

  profiles.push(newProfile)
  return newProfile
}

// Update a profile
export const updateProfile = (
  profileId: string,
  updates: Partial<ConversionProfile>,
): ConversionProfile | undefined => {
  const index = profiles.findIndex((profile) => profile.id === profileId)
  if (index === -1) return undefined

  const updatedProfile = {
    ...profiles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // If this is set as default, unset any other defaults
  if (updatedProfile.isDefault && !profiles[index].isDefault) {
    profiles = profiles.map((p) =>
      p.userId === updatedProfile.userId && p.id !== profileId ? { ...p, isDefault: false } : p,
    )
  }

  profiles[index] = updatedProfile
  return updatedProfile
}

// Delete a profile
export const deleteProfile = (profileId: string): boolean => {
  const initialLength = profiles.length
  profiles = profiles.filter((profile) => profile.id !== profileId)
  return profiles.length < initialLength
}

// Set a profile as default
export const setProfileAsDefault = (profileId: string, userId: string): ConversionProfile | undefined => {
  // Unset any existing defaults
  profiles = profiles.map((p) => (p.userId === userId ? { ...p, isDefault: p.id === profileId } : p))

  return profiles.find((p) => p.id === profileId)
}
