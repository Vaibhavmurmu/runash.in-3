import { type NextRequest, NextResponse } from "next/server"
import { checkEmailDomainSSO } from "@/lib/sso"
import { z } from "zod"

const checkSSOSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = checkSSOSchema.parse(body)

    const ssoCheck = await checkEmailDomainSSO(email)

    return NextResponse.json({
      hasSSO: ssoCheck.hasSSO,
      organizationName: ssoCheck.organization?.name,
      providerType: ssoCheck.provider?.provider_type,
      ssoUrl: ssoCheck.ssoUrl,
      redirectUrl: ssoCheck.hasSSO
        ? `/auth/sso/${ssoCheck.organization?.slug}?email=${encodeURIComponent(email)}`
        : null,
    })
  } catch (error) {
    console.error("SSO check error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
