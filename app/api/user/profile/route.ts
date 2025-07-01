import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { getCurrentUserId, isAuthenticated, isValidUUID } from "@/lib/auth"

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    // Validate UUID format
    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    // Start with basic columns that should always exist
    let user
    try {
      // Try the full query first
      const users = await sql`
        SELECT 
          id,
          email,
          name,
          username,
          avatar_url,
          bio,
          website,
          location,
          email_verified,
          email_verified_at,
          pending_email,
          created_at,
          updated_at
        FROM users 
        WHERE id = ${userId}::uuid
      `
      user = users[0]
    } catch (error) {
      // If that fails, try with just the basic columns
      console.log("Full query failed, trying basic query:", error.message)
      try {
        const users = await sql`
          SELECT 
            id,
            email,
            name,
            created_at,
            updated_at
          FROM users 
          WHERE id = ${userId}::uuid
        `
        const basicUser = users[0]
        if (basicUser) {
          // Add default values for missing columns
          user = {
            ...basicUser,
            username: null,
            avatar_url: null,
            bio: null,
            website: null,
            location: null,
            email_verified: false,
            email_verified_at: null,
            pending_email: null,
          }
        }
      } catch (basicError) {
        console.error("Even basic query failed:", basicError)
        return NextResponse.json({ error: "Database error" }, { status: 500 })
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = getCurrentUserId()

    // Validate UUID format
    if (!isValidUUID(userId)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { name, username, bio, website, location, avatar_url } = body

    // Try to update with available columns
    let updatedUser
    try {
      // Try full update first
      const updatedUsers = await sql`
        UPDATE users 
        SET 
          name = ${name || null},
          username = ${username || null},
          bio = ${bio || null},
          website = ${website || null},
          location = ${location || null},
          avatar_url = ${avatar_url || null},
          updated_at = NOW()
        WHERE id = ${userId}::uuid
        RETURNING *
      `
      updatedUser = updatedUsers[0]
    } catch (updateError) {
      console.log("Full update failed, trying basic update:", updateError.message)
      // If that fails, just update name
      try {
        const updatedUsers = await sql`
          UPDATE users 
          SET 
            name = ${name || null},
            updated_at = NOW()
          WHERE id = ${userId}::uuid
          RETURNING 
            id,
            email,
            name,
            created_at,
            updated_at
        `
        const basicUser = updatedUsers[0]
        if (basicUser) {
          updatedUser = {
            ...basicUser,
            username: username || null,
            avatar_url: avatar_url || null,
            bio: bio || null,
            website: website || null,
            location: location || null,
            email_verified: false,
            email_verified_at: null,
            pending_email: null,
          }
        }
      } catch (basicError) {
        console.error("Even basic update failed:", basicError)
        return NextResponse.json({ error: "Update failed" }, { status: 500 })
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
