import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/views/home/index.vue')
    },
    {
      path: '/index',
      component: () => import('@/views/index/index.vue')
    }
  ]
})

async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}

export { router, setupRouter }
