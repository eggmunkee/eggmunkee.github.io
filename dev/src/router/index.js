import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'root',
      component: () => import('../views/RootView.vue')
    },
    {
      path: '/',
      name: 'latest_music',
      component: () => import('../views/MusicSR2026View.vue')
    },
    {
      path: '/2025',
      name: 'legacy_music',
      component: () => import('../views/Music2025View.vue')
    }
  ]
})

export default router
