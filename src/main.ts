import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'
import '@manycore/miniapp-sdk'

import { setupRouter } from './router'

async function setupApp() {
  const app = createApp(App)

  await setupRouter(app)

  app.mount('#app')
}

setupApp()
