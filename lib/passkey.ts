import { neon } from "@neondatabase/serverless"
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import type { RegistrationResponseJSON, AuthenticationResponseJSON, AuthenticatorDevice } from "@simplewebauthn/types"

const sql = neon(process.env.DATABASE_URL!)

const rpName = "Runash.in"
const rpID = process.env.NODE_ENV === "production" ? "runash.in" : "localhost"
const origin = process.env.NODE_ENV === "production" ? "https://runash.in" : "http://localhost:3000"

export interface PasskeyCredential {
  id: number
  user_id: number
  credential_id: string
  public_key: Buffer
  counter: number
  device_type: string
  backup_eligible: boolean
  backup_state: boolean
  transports: string[]
  name?: string
  created_at: Date
  last_used_at?: Date
  is_active: boolean
}

export async function generatePasskeyRegistrationOptions(userId: number, userName: string, userEmail: string) {
  try {
    // Get existing credentials for this user
    const existingCredentials = await sql`
      SELECT credential_id, transports FROM passkey_credentials 
      WHERE user_id = ${userId} AND is_active = true
    `

    const excludeCredentials = existingCredentials.map((cred: any) => ({
      id: cred.credential_id,
      type: "public-key" as const,
      transports: cred.transports || [],
    }))

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: userId.toString(),
      userName: userEmail,
      userDisplayName: userName || userEmail,
      timeout: 60000,
      attestationType: "none",
      excludeCredentials,
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Prefer platform authenticators (biometrics)
      },
      supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
    })

    // Store challenge in database
    await sql`
      INSERT INTO passkey_challenges (user_id, challenge, type, expires_at)
      VALUES (${userId}, ${options.challenge}, 'registration', ${new Date(Date.now() + 5 * 60 * 1000)})
    `

    // Clean up old challenges
    await sql`
      DELETE FROM passkey_challenges 
      WHERE user_id = ${userId} AND expires_at < NOW()
    `

    return options
  } catch (error) {
    console.error("Error generating passkey registration options:", error)
    throw new Error("Failed to generate registration options")
  }
}

export async function verifyPasskeyRegistration(
  userId: number,
  response: RegistrationResponseJSON,
  expectedChallenge: string,
) {
  try {
    // Verify challenge exists and is valid
    const challengeResult = await sql`
      SELECT * FROM passkey_challenges 
      WHERE user_id = ${userId} 
        AND challenge = ${expectedChallenge} 
        AND type = 'registration' 
        AND expires_at > NOW()
    `

    if (challengeResult.length === 0) {
      throw new Error("Invalid or expired challenge")
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: false,
    })

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo

      // Store the credential
      await sql`
        INSERT INTO passkey_credentials (
          user_id, credential_id, public_key, counter, device_type, 
          backup_eligible, backup_state, transports
        ) VALUES (
          ${userId}, 
          ${Buffer.from(credentialID).toString("base64url")}, 
          ${credentialPublicKey}, 
          ${counter}, 
          ${credentialDeviceType}, 
          ${credentialBackedUp}, 
          ${credentialBackedUp}, 
          ${response.response.transports || []}
        )
      `

      // Clean up the challenge
      await sql`
        DELETE FROM passkey_challenges 
        WHERE user_id = ${userId} AND challenge = ${expectedChallenge}
      `

      return { verified: true, credentialID: Buffer.from(credentialID).toString("base64url") }
    }

    return { verified: false }
  } catch (error) {
    console.error("Error verifying passkey registration:", error)
    throw new Error("Failed to verify registration")
  }
}

export async function generatePasskeyAuthenticationOptions(userEmail?: string) {
  try {
    let allowCredentials: { id: string; type: "public-key"; transports?: string[] }[] = []

    if (userEmail) {
      // Get user's credentials
      const user = await sql`SELECT id FROM users WHERE email = ${userEmail}`
      if (user.length > 0) {
        const credentials = await sql`
          SELECT credential_id, transports FROM passkey_credentials 
          WHERE user_id = ${user[0].id} AND is_active = true
        `

        allowCredentials = credentials.map((cred: any) => ({
          id: cred.credential_id,
          type: "public-key" as const,
          transports: cred.transports || [],
        }))
      }
    }

    const options = await generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
      userVerification: "preferred",
      rpID,
    })

    // Store challenge (without user_id for usernameless flow)
    await sql`
      INSERT INTO passkey_challenges (challenge, type, expires_at)
      VALUES (${options.challenge}, 'authentication', ${new Date(Date.now() + 5 * 60 * 1000)})
    `

    return options
  } catch (error) {
    console.error("Error generating passkey authentication options:", error)
    throw new Error("Failed to generate authentication options")
  }
}

export async function verifyPasskeyAuthentication(response: AuthenticationResponseJSON, expectedChallenge: string) {
  try {
    // Verify challenge exists
    const challengeResult = await sql`
      SELECT * FROM passkey_challenges 
      WHERE challenge = ${expectedChallenge} 
        AND type = 'authentication' 
        AND expires_at > NOW()
    `

    if (challengeResult.length === 0) {
      throw new Error("Invalid or expired challenge")
    }

    // Find the credential
    const credentialResult = await sql`
      SELECT pc.*, u.id as user_id, u.email, u.name, u.avatar_url, u.role
      FROM passkey_credentials pc
      JOIN users u ON pc.user_id = u.id
      WHERE pc.credential_id = ${response.id} AND pc.is_active = true
    `

    if (credentialResult.length === 0) {
      throw new Error("Credential not found")
    }

    const credential = credentialResult[0]

    const authenticator: AuthenticatorDevice = {
      credentialID: Buffer.from(credential.credential_id, "base64url"),
      credentialPublicKey: credential.public_key,
      counter: credential.counter,
      transports: credential.transports,
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
      requireUserVerification: false,
    })

    if (verification.verified) {
      // Update counter and last used
      await sql`
        UPDATE passkey_credentials 
        SET counter = ${verification.authenticationInfo.newCounter}, 
            last_used_at = NOW()
        WHERE credential_id = ${response.id}
      `

      // Clean up the challenge
      await sql`
        DELETE FROM passkey_challenges WHERE challenge = ${expectedChallenge}
      `

      return {
        verified: true,
        user: {
          id: credential.user_id,
          email: credential.email,
          name: credential.name,
          avatar_url: credential.avatar_url,
          role: credential.role,
        },
      }
    }

    return { verified: false, user: null }
  } catch (error) {
    console.error("Error verifying passkey authentication:", error)
    throw new Error("Failed to verify authentication")
  }
}

export async function getUserPasskeys(userId: number): Promise<PasskeyCredential[]> {
  try {
    const credentials = await sql`
      SELECT * FROM passkey_credentials 
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `

    return credentials as PasskeyCredential[]
  } catch (error) {
    console.error("Error getting user passkeys:", error)
    return []
  }
}

export async function deletePasskey(userId: number, credentialId: string): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE passkey_credentials 
      SET is_active = false 
      WHERE user_id = ${userId} AND credential_id = ${credentialId}
    `

    return result.length > 0
  } catch (error) {
    console.error("Error deleting passkey:", error)
    return false
  }
}

export async function updatePasskeyName(userId: number, credentialId: string, name: string): Promise<boolean> {
  try {
    const result = await sql`
      UPDATE passkey_credentials 
      SET name = ${name}
      WHERE user_id = ${userId} AND credential_id = ${credentialId}
    `

    return result.length > 0
  } catch (error) {
    console.error("Error updating passkey name:", error)
    return false
  }
}
