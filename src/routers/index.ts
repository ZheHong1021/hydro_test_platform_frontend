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
  history: createWebHistory(),
  routes,
})

// 路由守衛
// router.beforeEach((to, from, next) => {
  // // 設置頁面標題
  // if (to.meta?.title) {
  //   document.title = `${to.meta.title} - 農業管理平台`
  // }

  // 身份驗證檢查
  // if (to.meta?.requiresAuth) {
    // // TODO: 檢查用戶是否已登入
    // const isAuthenticated = true // 暫時設為true，後續實作身份驗證

    // if (!isAuthenticated) {
    //   // 根據路由判斷跳轉到哪個登入頁面
    //   const loginPath = to.path.startsWith('/admin') ? '/admin/login' : '/app/login'
    //   next({ path: loginPath, query: { redirect: to.fullPath } })
    //   return
    // }

    // // 角色權限檢查
    // if (to.meta?.roles) {
    //   const userRole = 'admin' // 暫時設為admin，後續實作角色管理
    //   const hasPermission = to.meta.roles.includes(userRole)

    //   if (!hasPermission) {
    //     // 無權限，跳轉到錯誤頁面或首頁
    //     const homePath = to.path.startsWith('/admin') ? '/admin/dashboard' : '/app/home'
    //     next({ path: homePath })
    //     return
    //   }
    // }
  // }

//   next()
// })

// 路由錯誤處理
router.onError((error) => {
  console.error('路由錯誤:', error)
})

export default router