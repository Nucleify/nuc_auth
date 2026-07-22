import type { SupabaseClient } from '@supabase/supabase-js'

import type { LoginFieldsInterface, RegisterFieldsInterface } from 'nucleify'
import {
  getAndSetUser,
  getSupabaseClient,
  humanizeSupabaseError,
} from 'nucleify'

export type AuthFormFeedback = (
  message: string,
  severity: 'error' | 'info'
) => void

export async function submitAuthForm(
  data: LoginFieldsInterface | RegisterFieldsInterface,
  feedback?: AuthFormFeedback,
  client?: SupabaseClient
): Promise<boolean> {
  const supabase = client ?? getSupabaseClient()

  if (!('password_confirmation' in data)) {
    const login = data as LoginFieldsInterface
    const { error } = await supabase.auth.signInWithPassword({
      email: login.email,
      password: login.password,
    })
    if (error) {
      feedback?.(humanizeSupabaseError(error), 'error')
      return false
    }
  } else {
    const reg = data as RegisterFieldsInterface
    if (reg.password !== reg.password_confirmation) {
      feedback?.('Password confirmation does not match', 'error')
      return false
    }
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: reg.email,
      password: reg.password,
      options: { data: { name: reg.name } },
    })
    if (error) {
      feedback?.(humanizeSupabaseError(error), 'error')
      return false
    }
    const newUser = signUpData.user
    if (!newUser) {
      feedback?.('Check your email to finish registration.', 'info')
      return false
    }
    const { error: profileError } = await supabase.from('user_profiles').upsert(
      {
        id: newUser.id,
        name: reg.name,
        email: reg.email,
        language: 'en',
        country: 'poland',
        role: 'user',
      },
      { onConflict: 'id' }
    )
    if (profileError) {
      feedback?.(humanizeSupabaseError(profileError), 'error')
      return false
    }
  }

  await getAndSetUser(supabase)
  return true
}
