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
  AdParagraph,
  AdPassword,
  isEmpty,
  passwordsMatch,
  type RegisterFieldKey,
  t,
  useAuthForm,
} from 'nucleify'

import './_index.scss'

export function NucRegisterPage(): JSX.Element {
  const params = useParams<{ lang?: string }>()
  const lang = params?.lang ?? 'en'
  const { submitAndGo, registerFields, setRegisterFields, registerInputs } =
    useAuthForm('next', lang)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    void submitAndGo(registerFields)
  }

  function updateField(model: RegisterFieldKey, value: string): void {
    setRegisterFields((prev) => ({
      ...prev,
      [model]: value,
    }))
  }

  return (
    <div className="auth-card-container">
      <AdCard
        className="register-card"
        header={
          <div className="auth-card-header-container">
            <div className="auth-card-header">
              <AdHeading tag={1} text={t('auth-register-heading')} />
              <AdParagraph text={t('auth-register-has-account')}>
                <a href={`/${lang}/login`}>{t('auth-register-login')}</a>
              </AdParagraph>
            </div>
          </div>
        }
      >
        <form onSubmit={handleSubmit}>
          {registerInputs.map((field) => {
            const model = field.model as RegisterFieldKey
            const isPasswordField = field.type === 'password'

            return (
              <AdFloatLabel key={field.id}>
                {isPasswordField ? (
                  <AdPassword
                    id={field.id}
                    adType="main"
                    className="auth-input-text"
                    autoFocus={field.autofocus}
                    value={registerFields[model]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      updateField(model, event.target.value)
                    }}
                    passwordsMatch={
                      model === 'password_confirmation' &&
                      passwordsMatch(
                        registerFields.password,
                        registerFields.password_confirmation
                      )
                    }
                    emptyPassword={
                      model === 'password_confirmation' &&
                      isEmpty(registerFields.password)
                    }
                  />
                ) : (
                  <AdInputText
                    id={field.id}
                    adType="main"
                    type={field.type}
                    className="auth-input-text"
                    autoFocus={field.autofocus}
                    value={registerFields[model]}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      updateField(model, event.target.value)
                    }}
                  />
                )}
                <AdLabel forInput={field.id} label={t(field.label)} />
              </AdFloatLabel>
            )
          })}

          <AdButton label={t('auth-register-submit')} type="submit" />
        </form>
      </AdCard>
    </div>
  )
}
