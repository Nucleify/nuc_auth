<template>
  <div class="test-login-buttons-container">
    <ad-button
      icon="prime:crown"
      rounded
      @click="loginAndGo('admin')"
    />
    <ad-button
      icon="prime:user"
      severity="secondary"
      rounded
      @click="loginAndGo('user')"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from '#app'

import { testLogin } from 'atomic'

const route = useRoute()
const router = useRouter()
const lang = (route.params.lang as string) || 'en'

async function loginAndGo(role: string) {
  await testLogin(role)
  router.push(`/${lang}/settings#modules`)
}
</script>
