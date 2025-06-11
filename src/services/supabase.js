import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hjlxstghbigzizyfhykt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbHhzdGdoYmlneml6eWZoeWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjQzODMsImV4cCI6MjA2NTA0MDM4M30.hTUSabNu4Mu_q2ljgmUVblHf4zjBDWI89aVdL02tTvQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  },

  // Sign in existing user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}