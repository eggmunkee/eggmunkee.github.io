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
      name: 'music',
      component: () => import('../views/MusicView.vue')
    },
    {
      path: '/tx',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/tx/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
