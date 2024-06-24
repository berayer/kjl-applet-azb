import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import '@manycore/miniapp-sdk'
import { setupWxConfig } from '@/sdk/wxsdk'

import { setupRouter } from './router'

async function setupApp() {
  const app = createApp(App)

  await setupRouter(app)

  setupWxConfig()

  app.mount('#app')
}

setupApp()
