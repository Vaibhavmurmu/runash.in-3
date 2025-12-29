import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import AzureADProvider from "next-auth/providers/azure-ad"
import OktaProvider from "next-auth/providers/okta"
import { neon } from "@neondatabase/serverless"
import { compare } from "bcryptjs"
import { getSSOConfigForDomain, provisionSSOUser, logSSOLoginAttempt } from "./sso"

// Initialize the SQL client
const sql = neon(process.env.DATABASE_URL!)

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/get-started",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.OKTA_CLIENT_ID && process.env.OKTA_CLIENT_SECRET && process.env.OKTA_ISSUER
      ? [
          OktaProvider({
            clientId: process.env.OKTA_CLIENT_ID,
            clientSecret: process.env.OKTA_CLIENT_SECRET,
            issuer: process.env.OKTA_ISSUER,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in database
          const [user] = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          if (!user) {
            return null
          }

          // Check if password matches
          const passwordMatch = await compare(credentials.password, user.password_hash)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar_url,
            role: user.role,
          }
        } catch (error) {
          console.error("Error during authorization:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      if (
        account?.provider &&
        (account.provider === "google" ||
          account.provider === "github" ||
          account.provider === "azure-ad" ||
          account.provider === "okta")
      ) {
        try {
          // Check if this is an SSO login
          const domain = user.email?.split("@")[1]
          let ssoConfig = null

          if (domain) {
            ssoConfig = await getSSOConfigForDomain(domain)
          }

          // Check if user exists in database
          const [existingUser] = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `

          if (!existingUser) {
            if (ssoConfig) {
              // SSO user provisioning
              const provisionResult = await provisionSSOUser(
                user.email!,
                ssoConfig.organization.id,
                ssoConfig.provider.id,
                account.providerAccountId!,
                {
                  name: user.name,
                  image: user.image,
                  provider: account.provider,
                },
              )

              if (provisionResult) {
                token.role = provisionResult.user.role
                token.id = provisionResult.user.id
                token.ssoOrganization = ssoConfig.organization.id

                await logSSOLoginAttempt(ssoConfig.organization.id, ssoConfig.provider.id, true, {
                  userId: provisionResult.user.id,
                  externalId: account.providerAccountId,
                  email: user.email!,
                })
              }
            } else {
              // Regular OAuth user creation
              const [newUser] = await sql`
                INSERT INTO users (email, name, avatar_url, provider, provider_id, role, email_verified)
                VALUES (${user.email}, ${user.name}, ${user.image}, ${account.provider}, ${account.providerAccountId}, 'user', true)
                RETURNING *
              `
              token.role = newUser.role
              token.id = newUser.id
            }
          } else {
            token.role = existingUser.role
            token.id = existingUser.id
            token.ssoOrganization = existingUser.sso_organization_id

            // Update SSO mapping if this is an SSO login
            if (ssoConfig && existingUser.is_sso_user) {
              await logSSOLoginAttempt(ssoConfig.organization.id, ssoConfig.provider.id, true, {
                userId: existingUser.id,
                externalId: account.providerAccountId,
                email: user.email!,
              })
            }
          }
        } catch (error) {
          console.error("Error handling OAuth/SSO user:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.ssoOrganization = token.ssoOrganization as number
      }
      return session
    },
  },
}

export { authOptions as auth }
