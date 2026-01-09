import { createClient } from "@/lib/supabase/client"
import type { UserRole } from "@/lib/types"

const supabase = createClient()

export async function signUpUser(email: string, password: string, name: string, role: UserRole) {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/login`,
      data: {
        name,
        role,
      },
    },
  })

  if (authError) throw authError

  // Create user profile
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email,
        name,
        role,
      },
    ])

    if (profileError) throw profileError
  }

  return authData
}

export async function signInUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) throw error
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}
