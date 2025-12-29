import { type NextRequest, NextResponse } from "next/server"
import { generatePasskeyRegistrationOptions, verifyPasskeyRegistration } from "@/lib/passkey"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const registrationSchema = z.object({
  response: z.object({
    id: z.string(),
    rawId: z.string(),
    response: z.object({
      attestationObject: z.string(),
      clientDataJSON: z.string(),
      transports: z.array(z.string()).optional(),
    }),
    type: z.literal("public-key"),
  }),
  expectedChallenge: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const options = await generatePasskeyRegistrationOptions(
      Number.parseInt(session.user.id),
      session.user.name || "",
      session.user.email || "",
    )

    return NextResponse.json(options)
  } catch (error) {
    console.error("Passkey registration options error:", error)
    return NextResponse.json({ error: "Failed to generate registration options" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { response, expectedChallenge } = registrationSchema.parse(body)

    const result = await verifyPasskeyRegistration(Number.parseInt(session.user.id), response, expectedChallenge)

    if (result.verified) {
      return NextResponse.json({
        message: "Passkey registered successfully",
        credentialId: result.credentialID,
      })
    }

    return NextResponse.json({ error: "Failed to verify passkey registration" }, { status: 400 })
  } catch (error) {
    console.error("Passkey registration verification error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
