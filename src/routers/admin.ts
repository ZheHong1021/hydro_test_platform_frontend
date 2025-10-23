import type { RouteRecordRaw } from 'vue-router'
import { loadView } from './utils/loadView'
import AdminLayout from '../layouts/admin/AdminLayout.vue'

// 後台路由配置
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    component: AdminLayout,
    redirect: 'home',
    children: [
      // 首頁
      {
        path: 'home',
        name: 'AdminHome',
        component: loadView('admin/AdminHome'),
        meta: {
          title: '首頁',
          requiresAuth: true,
          roles: ['admin', 'manager']
        }
      },
      // 通知中心
      {
        path: 'notifications',
        name: 'AdminNotifications',
        component: loadView('admin/AdminNotifications'),
        meta: {
          title: '通知中心',
          requiresAuth: true
        }
      },

      // 個人設定
      {
        path: 'profile',
        name: 'UserProfile',
        component: loadView('Profile/UserProfile'),
        meta: {
          title: '個人資料',
          requiresAuth: true
        }
      },

      // 疲勞測試
      {
        path: 'fatigue-test',
        name: 'AdminFatigueTest',
        component: loadView('admin/Fatigue/FatigueTestIndex'),
        meta: {
          title: '疲勞測試',
          requiresAuth: true
        }
      },
    ]
  },
]