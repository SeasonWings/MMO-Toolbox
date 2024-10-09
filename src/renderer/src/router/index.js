import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/menu',
    component: () => import('../views/menu_view.vue')
  },
  {
    path: '/setting',
    component: () => import('../views/setting_view.vue'),
    redirect: '/setting/jx3setting',
    children: [
      {
        path: 'jx3setting',
        component: () => import('../views/setting_view/jx3setting_view.vue')
      },
      {
        path: 'ff14setting',
        component: () => import('../views/setting_view/ff14setting_view.vue')
      }
    ]
  },
  {
    path: '/find_jx3_user',
    component: () => import('../views/JX3Tools/backup_user/jx3_backup_user_view.vue')
  },
  {
    path: '/ff14_tools',
    component: () => import('../views/FF14Tools/ff14tools_view.vue')
  },
  {
    path: '/ff14_autoshengchan',
    component: () => import('../views/FF14Tools/auto_shengchan/ff14_auto_shengchan_view.vue')
  },
  {
    path: '/jx3_tools',
    component: () => import('../views/JX3Tools/jx3tools_view.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
