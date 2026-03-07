import { navigateTo, useRoute } from 'nuxt/app'

import { apiRequest, getAndSetUser, syncColorsWithDatabase } from 'nucleify'

export async function demoLogin(): Promise<void> {
  const route = useRoute()
  const lang = (route.params.lang as string) || 'en'

  await apiRequest(appUrl() + '/demo/session', 'POST')
  await getAndSetUser()
  await syncColorsWithDatabase()
  await navigateTo(`/${lang}/entities`)
}
