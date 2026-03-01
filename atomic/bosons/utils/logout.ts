import { navigateTo, useRoute } from 'nuxt/app'

import { apiHandle, removeUserFromSessionStorage } from 'atomic'

export async function logout(): Promise<void> {
  const lang = (useRoute().params.lang as string) || 'en'

  await apiHandle({
    url: appUrl() + '/logout',
    method: 'POST',
    onSuccess: () => {
      removeUserFromSessionStorage()
      navigateTo(`/${lang}/login`)
    },
  })
}
