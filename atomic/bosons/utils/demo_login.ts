import type { SupabaseClient } from '@supabase/supabase-js'
import { navigateTo } from 'nuxt/app'

import { getAndSetUser, syncColorsWithDatabase } from 'nucleify'

export interface DemoLoginDeps {
  supabase: SupabaseClient
  lang: string
  t: (key: string) => string
  flashToast: (message: string, type: 'success' | 'error') => void
}

function getCreateDemoUserUrl(): string {
  if (import.meta.client && typeof window !== 'undefined') {
    return new URL('/api/users/demo', window.location.origin).href
  }
  return '/api/users/demo'
}

export async function demoLogin(deps: DemoLoginDeps): Promise<void> {
  const { supabase, lang, t, flashToast } = deps

  let creds: { email: string; password: string }
  try {
    creds = await $fetch<{ email: string; password: string }>(
      getCreateDemoUserUrl(),
      { method: 'POST' }
    )
  } catch {
    flashToast(t('dev-check-demo-failed'), 'error')
    return
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: creds.email,
    password: creds.password,
  })
  if (error) {
    flashToast(t('dev-check-demo-failed'), 'error')
    return
  }
  await getAndSetUser(supabase)
  await syncColorsWithDatabase()
  await navigateTo(`/${lang}/entities`)
}
