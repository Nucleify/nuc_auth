import { navigateTo, useRoute } from 'nuxt/app'

import { removeUserFromSessionStorage } from 'nucleify'
import { useSupabaseClient } from 'nuc_client'

export async function logout(): Promise<void> {
  const lang = (useRoute().params.lang as string) || 'en'
  const supabase = useSupabaseClient()
  await supabase.auth.signOut()
  removeUserFromSessionStorage()
  await navigateTo(`/${lang}/login`)
}
