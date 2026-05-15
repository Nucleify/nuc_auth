import { useRoute } from 'nuxt/app'

import type {
  LoginFieldsInterface,
  RegisterFieldsInterface,
  UseAuthFormInterface,
} from 'nucleify'
import {
  getAndSetUser,
  loginFields,
  loginInputs,
  navigateToUrl,
  registerFields,
  registerInputs,
  syncColorsWithDatabase,
  useAtomicToast,
} from 'nucleify'

import { useSupabaseClient } from '../../../../../nuxt/composables/supabase/client'

export function useAuthForm(): UseAuthFormInterface {
  const route = useRoute()
  const lang = (route.params.lang as string) || 'en'
  const { flashToast } = useAtomicToast()

  async function submitForm(
    data: LoginFieldsInterface | RegisterFieldsInterface
  ): Promise<boolean> {
    const supabase = useSupabaseClient()

    if (!('password_confirmation' in data)) {
      const login = data as LoginFieldsInterface
      const { error } = await supabase.auth.signInWithPassword({
        email: login.email,
        password: login.password,
      })
      if (error) {
        flashToast(error.message, 'error')
        return false
      }
    } else {
      const reg = data as RegisterFieldsInterface
      if (reg.password !== reg.password_confirmation) {
        flashToast('Password confirmation does not match', 'error')
        return false
      }
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: reg.email,
        password: reg.password,
        options: { data: { name: reg.name } },
      })
      if (error) {
        flashToast(error.message, 'error')
        return false
      }
      const newUser = signUpData.user
      if (!newUser) {
        flashToast('Check your email to finish registration.', 'info')
        return false
      }
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert(
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
        flashToast(profileError.message, 'error')
        return false
      }
    }

    await getAndSetUser(supabase)
    await syncColorsWithDatabase()
    return true
  }

  async function submitAndGo(
    data: LoginFieldsInterface | RegisterFieldsInterface
  ): Promise<void> {
    if (!(await submitForm(data))) return
    navigateToUrl(`/${lang}/entities`)
  }

  return {
    submitForm,
    submitAndGo,
    loginFields,
    loginInputs,
    registerFields,
    registerInputs,
  }
}
