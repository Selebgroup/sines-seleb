import { supabase, type LoginData, type User } from '../koneksi_supabase'

// Login function
export async function loginUser(loginData: LoginData) {
  try {
    const { data, error } = await supabase
      .from('login')
      .select('*')
      .eq('username', loginData.username)
      .eq('password', loginData.password)
      .single()

    if (error) {
      throw new Error('Username atau password salah')
    }

    if (!data) {
      throw new Error('User tidak ditemukan')
    }

    // Store user session in localStorage
    const userSession = {
      id: data.id || crypto.randomUUID(),
      username: data.username,
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    }

    localStorage.setItem('userSession', JSON.stringify(userSession))
    
    return {
      success: true,
      user: userSession,
      message: 'Login berhasil'
    }
  } catch (error) {
    return {
      success: false,
      user: null,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat login'
    }
  }
}

// Register function
export async function registerUser(userData: LoginData) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('login')
      .select('username')
      .eq('username', userData.username)
      .single()

    if (existingUser) {
      throw new Error('Username sudah terdaftar')
    }

    // Insert new user
    const { data, error } = await supabase
      .from('login')
      .insert([
        {
          username: userData.username,
          password: userData.password
        }
      ])
      .select()
      .single()

    if (error) {
      throw new Error('Gagal membuat akun: ' + error.message)
    }

    return {
      success: true,
      user: data,
      message: 'Akun berhasil dibuat'
    }
  } catch (error) {
    return {
      success: false,
      user: null,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar'
    }
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const userSession = localStorage.getItem('userSession')
  if (!userSession) return false

  try {
    const session = JSON.parse(userSession)
    return session.isAuthenticated === true
  } catch {
    return false
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  
  const userSession = localStorage.getItem('userSession')
  if (!userSession) return null

  try {
    const session = JSON.parse(userSession)
    return session.isAuthenticated ? session : null
  } catch {
    return null
  }
}

// Logout function
export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userSession')
  }
}

// Check session validity (optional: add expiration logic)
export function isSessionValid(): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Add session expiration logic here if needed
  // For now, just check if user exists
  return true
}