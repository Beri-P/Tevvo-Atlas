import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient, User, AuthError, Session } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,    // save access & refresh tokens in localStorage
      autoRefreshToken: true,  // automatically refresh expired JWTs
      detectSessionInUrl: false // you’re not using URL-based OAuth callbacks here
    }
  }
)

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email: string, password: string): Promise<{ data: any; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  },

  // Sign in existing user
  async signIn(email: string, password: string): Promise<{ data: any; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out current user
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}