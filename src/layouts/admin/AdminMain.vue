<template>
  <el-main class="admin-main">
    <div class="main-content">
      <div class="breadcrumb-container" v-if="showBreadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadcrumbItems"
            :key="item.path"
            :to="item.path"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="page-header" v-if="pageTitle || $slots.actions">
        <div class="page-header-left">
          <h1 v-if="pageTitle" class="page-title">{{ pageTitle }}</h1>
          <p v-if="pageDescription" class="page-description">{{ pageDescription }}</p>
        </div>
        <div class="page-header-right" v-if="$slots.actions">
          <slot name="actions" />
        </div>
      </div>

      <div class="content-wrapper">
        <slot />
      </div>
    </div>
  </el-main>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Props {
  pageTitle?: string
  pageDescription?: string
  showBreadcrumb?: boolean
  breadcrumbItems?: Array<{ title: string; path?: string }>
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumb: true,
  breadcrumbItems: () => []
})

const route = useRoute()
const router = useRouter()

const defaultBreadcrumbItems = computed(() => {
  if (props.breadcrumbItems.length > 0) {
    return props.breadcrumbItems
  }

  const pathSegments = route.path.split('/').filter(Boolean)
  
  // 如果是首頁或根路徑，只顯示首頁
  if (route.path === '/' || route.path === '/home' || pathSegments.length === 0) {
    return [{ title: '首頁', path: '/home' }]
  }

  const breadcrumbs = [{ title: '首頁', path: '/home' }]

  let currentPath = ''
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`
    
    // 跳過根路徑，直接處理實際的頁面路徑
    if (segment && segment !== 'admin' && currentPath !== '/home') {
      breadcrumbs.push({
        title: getBreadcrumbTitle(currentPath),
        path: currentPath
      })
    }
  })

  return breadcrumbs
})

const breadcrumbItems = computed(() => {
  return props.breadcrumbItems.length > 0 ? props.breadcrumbItems : defaultBreadcrumbItems.value
})

const getBreadcrumbTitle = (path: string): string => {
  // 嘗試從路由配置中找到對應的 meta.title
  const matchedRoutes = router.getRoutes()
  
  // 移除開頭的斜線來匹配相對路徑的路由配置
  const relativePath = path.startsWith('/') ? path.substring(1) : path
  
  const foundRoute = matchedRoutes.find(route => {
    // 直接匹配相對路徑
    if (route.path === relativePath) return true
    
    // 匹配完整路徑
    if (route.path === path) return true
    
    return false
  })

  if (foundRoute?.meta?.title) {
    return foundRoute.meta.title as string
  }

  // 如果在路由中找不到，使用備用的標題映射
  const titleMap: Record<string, string> = {
    '/home': '首頁',
    'home': '首頁',
    '/fatigue-test': '疲勞測試',
    'fatigue-test': '疲勞測試',
    '/dashboard': '管理儀表板',
    'dashboard': '管理儀表板',
    '/profile': '個人資料',
    'profile': '個人資料',
    '/notifications': '通知中心',
    'notifications': '通知中心'
  }

  return titleMap[path] || titleMap[relativePath] || relativePath
}
</script>

<style scoped>
.admin-main {
  background-color: var(--el-bg-color-page);
  min-height: calc(100vh - 60px - 60px);
  padding: 0;
}

.main-content {
  padding: 1rem;
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.breadcrumb-container {
  margin-bottom: 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.page-header-left {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.page-description {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.4;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-left: 24px;
}

.content-wrapper {
  background-color: var(--el-color-white);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 500px;
}

/* 麵包屑樣式優化 */
.breadcrumb-container :deep(.el-breadcrumb) {
  font-size: 14px;
}

/* 最後一個麵包屑項目（當前頁面）- 不可點擊 */
.breadcrumb-container :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--el-text-color-primary);
  font-weight: 500;
  cursor: default;
}

/* 可點擊的麵包屑項目 - 使用藍色強調 */
.breadcrumb-container :deep(.el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner) {
  color: var(--el-color-primary);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 4px;
  padding: 2px 6px;
  margin: -2px -6px;
}

/* 可點擊項目的 hover 效果 */
.breadcrumb-container :deep(.el-breadcrumb__item:not(:last-child) .el-breadcrumb__inner:hover) {
  color: var(--el-color-primary-dark-2);
  background-color: var(--el-color-primary-light-9);
  text-decoration: underline;
}

/* 響應式調整 */
@media (max-width: 1024px) {
  .main-content {
    padding: 20px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-header-right {
    margin-left: 0;
    width: 100%;
    justify-content: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .content-wrapper {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .content-wrapper {
    padding: 16px;
    border-radius: 6px;
  }
}

/* 特殊內容區域樣式 */
.content-wrapper.no-padding {
  padding: 0;
}

.content-wrapper.full-height {
  min-height: calc(100vh - 200px);
}
</style>