import type { LoginFieldsInterface, UserRoleType } from 'nucleify'
import { getAndSetUser, syncColorsWithDatabase, useAtomicToast } from 'nucleify'

import { useSupabaseClient } from '../../../../../nuxt/composables/supabase/client'

export async function testLogin(role: UserRoleType): Promise<void> {
  const { flashToast } = useAtomicToast()
  const credentials: Record<UserRoleType, LoginFieldsInterface | undefined> = {
    user: { email: 'test_user@nucleify.io', password: 'test_user123' },
    admin: { email: 'admin@nucleify.io', password: 'password' },
    test_user: { email: 'test_user@nucleify.io', password: 'test_user123' },
    test_admin: { email: 'test_admin@nucleify.io', password: 'test_admin123' },
    test_tech: { email: 'test_tech@nucleify.io', password: 'test_tech123' },
    super_admin: { email: 's.radomski19@gmail.com', password: 'password' },
    demo: { email: '', password: '' },
  }

  const userCredentials = credentials[role]

  if (!userCredentials?.email) {
    console.error('Invalid role:', role)
    return
  }

  const supabase = useSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword(userCredentials)
  if (error) {
    flashToast(error.message, 'error')
    return
  }
  await getAndSetUser(supabase)
  await syncColorsWithDatabase()
}
