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
      // 儀表板
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: loadView('admin/AdminDashboard'),
        meta: {
          title: '管理儀表板',
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

      // // 作物管理
      // {
      //   path: 'crops',
      //   redirect: '/admin/crops/list',
      //   children: [
      //     {
      //       path: 'list',
      //       name: 'AdminCropsList',
      //       component: loadView('Home'), // 暫時使用Home
      //       meta: {
      //         title: '作物列表',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'add',
      //       name: 'AdminCropsAdd',
      //       component: loadView('Home'),
      //       meta: {
      //         title: '新增作物',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'edit/:id',
      //       name: 'AdminCropsEdit',
      //       component: loadView('Home'),
      //       meta: {
      //         title: '編輯作物',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'calendar',
      //       name: 'AdminCropsCalendar',
      //       component: loadView('Home'),
      //       meta: {
      //         title: '種植日曆',
      //         requiresAuth: true
      //       }
      //     },
      //     {
      //       path: 'analysis',
      //       name: 'AdminCropsAnalysis',
      //       component: loadView('Home'),
      //       meta: {
      //         title: '作物分析',
      //         requiresAuth: true
      //       }
      //     }
      //   ]
      // },
    ]
  },

  // 後台登入頁面（不使用Layout）
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: loadView('Home'), // 暫時使用Home，後續建立登入頁面
    meta: {
      title: '後台登入',
      hideInMenu: true
    }
  }
]