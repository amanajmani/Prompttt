import { createSupabaseClient } from './supabase'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export class AuthService {
  private supabase = createSupabaseClient()

  async signUp(email: string, password: string, metadata?: {
    username?: string
    full_name?: string
  }) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) throw error

    // Create profile if user was created
    if (data.user && !error) {
      await this.createProfile(data.user.id, {
        username: metadata?.username,
        full_name: metadata?.full_name
      })
    }

    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  async signInWithOAuth(provider: 'google' | 'github') {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })

    if (error) throw error
  }

  async updatePassword(password: string) {
    const { error } = await this.supabase.auth.updateUser({
      password
    })

    if (error) throw error
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession()
    if (error) throw error
    return data.session
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser()
    if (error) throw error
    return data.user
  }

  private async createProfile(userId: string, data: {
    username?: string
    full_name?: string
  }) {
    const { error } = await this.supabase
      .from('profiles')
      .insert({
        id: userId,
        username: data.username,
        full_name: data.full_name,
        is_creator: true // All users are creators by default
      })

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()