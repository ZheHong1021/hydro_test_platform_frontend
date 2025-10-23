import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { loadView } from './utils/loadView'
import { adminRoutes } from './admin'

// 合併所有路由
const routes: RouteRecordRaw[] = [
  // 後台路由
  ...adminRoutes,

  // 404 錯誤頁面 - 必須放在最後
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: loadView('System/error/NotFound'),
    meta: {
      title: '頁面不存在'
    }
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守衛
router.beforeEach((to, from, next) => {
  // 設置頁面標題
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 油壓測試平台`
  }
  next()
})

// 路由錯誤處理
router.onError((error) => {
  console.error('路由錯誤:', error)
})

export default router