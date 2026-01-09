import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { action, email, password, name, role } = await request.json()

  try {
    const supabase = await createClient()

    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
        },
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        await supabase.from("users").insert([
          {
            id: data.user.id,
            email,
            name,
            role,
          },
        ])
      }

      return NextResponse.json({ success: true, data })
    }

    if (action === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    if (action === "signout") {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
