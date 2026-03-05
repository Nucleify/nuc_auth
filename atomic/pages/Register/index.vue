<template>
  <nuc-home-link />
  <div class="auth-card-container">
    <ad-card class="register-card">
      <template #header>
        <div class="auth-card-header-container">
          <div class="auth-card-header">
            <ad-heading :tag="1" :text="t('auth-register-heading')" />

            <ad-paragraph :text="t('auth-register-has-account')">
              <ad-anchor :href="`/${lang}/login`" :label="t('auth-register-login')" />
            </ad-paragraph>
          </div>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="submitAndGo(registerFields)">
          <ad-float-label v-for="(field, index) in registerInputs" :key="index">
            <ad-input-text
              v-if="field.type !== 'password'"
              :id="field.id"
              v-model="registerFields[field.model]"
              ad-type="main"
              :type="field.type"
              class="auth-input-text"
              :autofocus="field.autofocus"
            />

            <ad-password
              v-else
              :id="field.id"
              v-model="registerFields[field.model]"
              ad-type="main"
              class="auth-input-text"
              :autofocus="field.autofocus"
              :passwords-match="
                passwordsMatch(
                  registerFields['password'],
                  registerFields['password_confirmation']
                ) && field.model === 'password_confirmation'
              "
              :empty-password="
                isEmpty(registerFields['password']) &&
                field.model === 'password_confirmation'
              "
              :empty-confirm-password="
                isEmpty(registerFields['password_confirmation']) &&
                field.model === 'password_confirmation'
              "
            />

            <ad-label :for="field.id" :label="t(field.label)" />
          </ad-float-label>

          <ad-button :label="t('auth-register-submit')" type="submit" />
        </form>
      </template>
    </ad-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { isEmpty, passwordsMatch, useAuthForm } from 'atomic'

const route = useRoute()
const { t } = useI18n()
const lang = computed(() => (route.params.lang as string) || 'en')

const { submitAndGo, registerFields, registerInputs } = useAuthForm()

onMounted((): void => {
  passwordsMatch(
    registerFields.value.password,
    registerFields.value.password_confirmation
  )
})
</script>
