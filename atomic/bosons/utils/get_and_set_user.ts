import type { SupabaseClient } from '@supabase/supabase-js'

import type { NucUserObjectInterface } from 'nucleify'
import { setUserToSessionStorage, userRequests } from 'nucleify'
import { useSupabaseClient } from 'nuc_client'

export async function getAndSetUser(client?: SupabaseClient): Promise<void> {
  const supabase = client ?? useSupabaseClient()
  const { results }: ReturnType<typeof userRequests> = userRequests()

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser()
  if (authErr || !user) {
    results.value = [] as never
    return
  }

  const { data: profile, error: profileErr } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (profileErr || !profile) {
    results.value = [] as never
    return
  }

  const mapped: NucUserObjectInterface = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone_number: profile.phone_number ?? undefined,
    avatar: profile.avatar ?? undefined,
    language: profile.language ?? undefined,
    country: profile.country ?? undefined,
    role: profile.role,
    created_at: profile.created_at ?? undefined,
    updated_at: profile.updated_at ?? undefined,
    email_verified_at: user.email_confirmed_at ?? undefined,
  }

  results.value = mapped as never
  setUserToSessionStorage(mapped)
}
