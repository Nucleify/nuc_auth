'use client'

import { useParams } from 'next/navigation'
import type { ChangeEvent, FormEvent, JSX } from 'react'

import {
  AdButton,
  AdCard,
  AdFloatLabel,
  AdHeading,
  AdInputText,
  AdLabel,
  AdLogo,
  AdParagraph,
  type LoginFieldKey,
  NucHomeLink,
  NucTestLoginButtons,
  t,
  useAuthForm,
} from 'nucleify'

import './_index.scss'

export function NucLoginPage(): JSX.Element {
  const params = useParams<{ lang?: string }>()
  const lang = params?.lang ?? 'en'
  const { submitAndGo, loginFields, setLoginFields, loginInputs } = useAuthForm(
    'next',
    lang
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    void submitAndGo(loginFields)
  }

  return (
    <>
      <NucHomeLink />
      <AdCard
        className="login-card"
        header={
          <div className="auth-card-header-container">
            <div className="auth-card-header">
              <AdLogo dimensions={64} adType="main" />
              <AdHeading tag={1} text={t('auth-login-heading')} />
              <AdParagraph className="mb-2" text={t('auth-login-no-account')}>
                <a href={`/${lang}/register`}>{t('auth-login-create')}</a>
              </AdParagraph>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          {loginInputs.map((field) => {
            const model = field.model as LoginFieldKey

            return (
              <AdFloatLabel key={field.id}>
                <AdInputText
                  id={field.id}
                  adType="main"
                  type={field.type}
                  className="auth-input-text"
                  autoFocus={field.autofocus}
                  value={loginFields[model]}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = event.target.value
                    setLoginFields((prev) => ({
                      ...prev,
                      [model]: value,
                    }))
                  }}
                />
                <AdLabel forInput={field.id} label={t(field.label)} />
              </AdFloatLabel>
            )
          })}

          <AdButton label={t('auth-login-submit')} type="submit" />
        </form>
      </AdCard>
      <NucTestLoginButtons />
    </>
  )
}
