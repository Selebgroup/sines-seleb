import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wsgqastrtdkcrgpzgzhp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzZ3Fhc3RydGRrY3JncHpnemhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTc1NzUsImV4cCI6MjA3NTQ3MzU3NX0.MJ76HiU_J0apL9jV2dpqq492X-8ORRl0q6uoW7O-lcQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface LoginData {
  username: string
  password: string
}

export interface User {
  id?: string
  username: string
  created_at?: string
}