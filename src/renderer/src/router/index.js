import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/menu',
    component: () => import('../views/menu_view.vue')
  },
  {
    path: '/setting',
    component: () => import('../views/setting_view.vue')
  },
  {
    path: '/find_jx3_user',
    component: () => import('../views/find_jx3_user_view.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
