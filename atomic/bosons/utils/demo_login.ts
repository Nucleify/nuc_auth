import { navigateTo } from 'nuxt/app'

import { getAndSetUser, syncColorsWithDatabase } from 'nucleify'

import type { SupabaseClient } from '@supabase/supabase-js'

export interface DemoLoginDeps {
  supabase: SupabaseClient
  lang: string
  t: (key: string) => string
  flashToast: (message: string, type: 'success' | 'error') => void
}

function getCreateDemoUserUrl(): string {
  if (import.meta.client && typeof window !== 'undefined') {
    return new URL('/api/dev/create-demo-user', window.location.origin).href
  }
  return '/api/dev/create-demo-user'
}

/**
 * Tworzy świeże konto + przykładowe dane (articles, contacts, money, files), loguje.
 * Composables (`useI18n`, `useSupabaseClient`, …) muszą być wywołane w `setup` komponentu
 * i przekazane w `deps` — nie wołaj ich wewnątrz tej funkcji z handlera kliknięcia.
 */
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
