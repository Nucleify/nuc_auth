import { useRoute, useRouter } from 'nuxt/app'

import type {
  LoginFieldsInterface,
  RegisterFieldsInterface,
  UseAuthFormInterface,
} from 'atomic'
import {
  apiHandle,
  getAndSetUser,
  loginFields,
  loginInputs,
  navigateToUrl,
  registerFields,
  registerInputs,
  syncColorsWithDatabase,
} from 'atomic'

export function useAuthForm(): UseAuthFormInterface {
  let url: string
  const route = useRoute()
  const lang = (route.params.lang as string) || 'en'

  async function submitForm(
    data: LoginFieldsInterface | RegisterFieldsInterface
  ): Promise<void> {
    switch (true) {
      case !('password_confirmation' in data):
        url = '/login'
        break
      case 'password_confirmation' in data:
        url = '/register'
        break
      default:
        throw Error
    }

    await apiHandle({
      url,
      method: 'POST',
      data,
      onSuccess: async (): Promise<void> => {
        await getAndSetUser()
        await syncColorsWithDatabase()
      },
    })
  }

  async function submitAndGo(
    data: LoginFieldsInterface | RegisterFieldsInterface
  ): Promise<void> {
    await submitForm(data)
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
