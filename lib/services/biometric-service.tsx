export interface BiometricCredential {
  id: string
  publicKey: string
  counter: number
  createdAt: Date
}

export interface BiometricAuthResult {
  success: boolean
  credential?: BiometricCredential
  error?: string
}

export class BiometricService {
  private static instance: BiometricService
  private isClient = typeof window !== "undefined"

  static getInstance(): BiometricService {
    if (!BiometricService.instance) {
      BiometricService.instance = new BiometricService()
    }
    return BiometricService.instance
  }

  async isSupported(): Promise<boolean> {
    if (!this.isClient) return false

    try {
      return !!(
        window.PublicKeyCredential &&
        window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
        (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())
      )
    } catch (error) {
      console.error("Error checking biometric support:", error)
      return false
    }
  }

  async register(userId: string, userName: string): Promise<BiometricAuthResult> {
    if (!this.isClient) {
      return { success: false, error: "Not available on server" }
    }

    try {
      const supported = await this.isSupported()
      if (!supported) {
        return { success: false, error: "Biometric authentication not supported" }
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "RunAsh AI Pay",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "direct",
      }

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential

      if (!credential) {
        return { success: false, error: "Failed to create credential" }
      }

      const response = credential.response as AuthenticatorAttestationResponse
      const publicKey = Array.from(new Uint8Array(response.getPublicKey()!))

      const biometricCredential: BiometricCredential = {
        id: credential.id,
        publicKey: btoa(String.fromCharCode(...publicKey)),
        counter: response.getAuthenticatorData ? 0 : 0,
        createdAt: new Date(),
      }

      // Store credential in localStorage for demo
      localStorage.setItem(`biometric_${userId}`, JSON.stringify(biometricCredential))

      return { success: true, credential: biometricCredential }
    } catch (error) {
      console.error("Biometric registration error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Registration failed" }
    }
  }

  async authenticate(userId: string): Promise<BiometricAuthResult> {
    if (!this.isClient) {
      return { success: false, error: "Not available on server" }
    }

    try {
      const supported = await this.isSupported()
      if (!supported) {
        return { success: false, error: "Biometric authentication not supported" }
      }

      // Get stored credential
      const storedCredential = localStorage.getItem(`biometric_${userId}`)
      if (!storedCredential) {
        return { success: false, error: "No biometric credential found" }
      }

      const credential = JSON.parse(storedCredential) as BiometricCredential
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [
          {
            id: new TextEncoder().encode(credential.id),
            type: "public-key",
          },
        ],
        timeout: 60000,
        userVerification: "required",
      }

      const authCredential = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential

      if (!authCredential) {
        return { success: false, error: "Authentication failed" }
      }

      return { success: true, credential }
    } catch (error) {
      console.error("Biometric authentication error:", error)
      return { success: false, error: error instanceof Error ? error.message : "Authentication failed" }
    }
  }

  async hasCredential(userId: string): Promise<boolean> {
    if (!this.isClient) return false

    try {
      const storedCredential = localStorage.getItem(`biometric_${userId}`)
      return !!storedCredential
    } catch (error) {
      return false
    }
  }

  async removeCredential(userId: string): Promise<void> {
    if (!this.isClient) return

    try {
      localStorage.removeItem(`biometric_${userId}`)
    } catch (error) {
      console.error("Error removing biometric credential:", error)
    }
  }
}

export const biometricService = BiometricService.getInstance()
