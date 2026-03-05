<template>
  <nuc-home-link />
  <ad-card class="login-card">
    <template #header>
      <div class="auth-card-header-container">
        <div class="auth-card-header">
          <ad-logo :dimensions="64" ad-type="main" />
          <ad-heading :tag="1" :text="t('auth-login-heading')" />

          <ad-paragraph class="mb-2" :text="t('auth-login-no-account')">
            <ad-anchor :href="`/${lang}/register`" :label="t('auth-login-create')" />
          </ad-paragraph>
        </div>
      </div>
    </template>
    <template #content>
      <form @submit.prevent="submitAndGo(loginFields)">
        <ad-float-label v-for="(field, index) in loginInputs" :key="index">
          <ad-input-text
            :id="field.id"
            v-model="loginFields[field.model]"
            ad-type="main"
            :type="field.type"
            class="auth-input-text"
            :autofocus="field.autofocus"
          />
          <ad-label :for="field.id" :label="t(field.label)" />
        </ad-float-label>

        <ad-button :label="t('auth-login-submit')" type="submit" />
      </form>
    </template>
  </ad-card>

  <nuc-test-login-buttons />
</template>

<script setup lang="ts">
import { useRoute } from 'nuxt/app'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthForm } from 'atomic'

const route = useRoute()
const { t } = useI18n()
const lang = computed(() => (route.params.lang as string) || 'en')

const { submitAndGo, loginFields, loginInputs } = useAuthForm()
</script>
