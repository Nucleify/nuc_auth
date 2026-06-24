'use client'

import { useParams } from 'next/navigation'
import type { JSX } from 'react'

import { AdButton, navigateToUrl, testLogin } from 'nucleify'

import './_index.scss'

export function NucTestLoginButtons(): JSX.Element {
  const params = useParams<{ lang?: string }>()
  const lang = params?.lang ?? 'en'

  async function loginAndGo(role: 'admin' | 'user'): Promise<void> {
    await testLogin(role)
    navigateToUrl(`/${lang}/entities`)
  }

  return (
    <div className="test-login-buttons-container">
      <AdButton
        icon="prime:crown"
        rounded
        type="button"
        onClick={() => void loginAndGo('admin')}
      />
      <AdButton
        icon="prime:user"
        severity="secondary"
        rounded
        type="button"
        onClick={() => void loginAndGo('user')}
      />
    </div>
  )
}
