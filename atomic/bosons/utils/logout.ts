import {
  getCurrentLang,
  getSupabaseClient,
  navigateToUrl,
  removeUserFromSessionStorage,
} from 'nucleify'

export async function logout(): Promise<void> {
  const lang = getCurrentLang()
  const supabase = getSupabaseClient()
  await supabase.auth.signOut()

  removeUserFromSessionStorage()

  navigateToUrl(`/${lang}/login`)
}
