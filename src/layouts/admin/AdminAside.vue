<template>
  <el-aside
    :width="isCollapsed ? '64px' : '240px'"
    class="admin-aside"
  >
    <div class="aside-header">
      <el-button
        type="text"
        :icon="isCollapsed ? Expand : Fold"
        @click="toggleCollapse"
        class="collapse-btn"
      />
    </div>

    <el-scrollbar class="aside-scrollbar">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :unique-opened="true"
        router
        class="aside-menu"
      >
        <MenuItems :menu-items="menuItems" />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts" setup>
import { ref, computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import {
  WarnTriangleFilled,
  DataBoard,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import MenuItems from './components/MenuItems.vue'

interface MenuItem {
  index: string
  title: string
  icon: any
  children?: MenuItem[]
}

const route = useRoute()
const isCollapsed = ref(false)

// 根據當前路由動態設置活躍菜單
const activeMenu = computed(() => {
  const currentPath = route.path
  
  // 根據路由路徑匹配對應的菜單項
  if (currentPath === '/' || currentPath === '/home') {
    return '/home'
  } else if (currentPath === '/fatigue-test') {
    return '/fatigue-test'
  } else if (currentPath === '/dashboard') {
    return '/dashboard'
  }
  
  // 默認返回首頁
  return '/home'
})

// 切換側邊欄折疊狀態
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 後台選單路由配置
const menuItems = ref<MenuItem[]>([
  {
    index: '/home',
    title: '首頁',
    icon: markRaw(DataBoard) // <- markRaw 包裝
  },
  {
    index: '/fatigue-test',
    title: '疲勞測試',
    icon: markRaw(WarnTriangleFilled) // <- markRaw 包裝
  },
])

// 新增選單項目的方法
const addMenuItem = (item: MenuItem) => {
  menuItems.value.push(item)
}

// 移除選單項目的方法
const removeMenuItem = (index: string) => {
  const itemIndex = menuItems.value.findIndex((item: MenuItem) => item.index === index)
  if (itemIndex > -1) {
    menuItems.value.splice(itemIndex, 1)
  }
}

// 新增子選單項目的方法
const addSubMenuItem = (parentIndex: string, subItem: MenuItem) => {
  const parentItem = menuItems.value.find((item: MenuItem) => item.index === parentIndex)
  if (parentItem && parentItem.children) {
    parentItem.children.push(subItem)
  }
}

// 暴露方法供外部使用
defineExpose({
  addMenuItem,
  removeMenuItem,
  addSubMenuItem,
  menuItems
})
</script>

<style scoped>
.admin-aside {
  background-color: var(--el-color-white);
  border-right: 1px solid var(--el-border-color-light);
  transition: width 0.3s ease;
}

.aside-header {
  padding: 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: flex-end;
}

.collapse-btn {
  color: var(--el-text-color-regular);
}

.collapse-btn:hover {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}


.aside-scrollbar {
  height: calc(100vh - 60px - 48px);
}

.aside-menu {
  border-right: none;
  background-color: transparent;
}

.aside-menu .el-menu-item,
.aside-menu .el-sub-menu__title {
  height: 48px;
  line-height: 48px;
  margin: 4px 8px;
  border-radius: 6px;
}

.aside-menu .el-menu-item:hover,
.aside-menu .el-sub-menu__title:hover {
  background-color: var(--el-color-primary-light-9);
}

.aside-menu .el-menu-item.is-active {
  background-color: var(--el-color-primary-light-8);
  color: var(--el-color-primary);
}

/* PC優化 - 更好的滾動條 */
.aside-scrollbar :deep(.el-scrollbar__bar) {
  opacity: 0.3;
}

.aside-scrollbar:hover :deep(.el-scrollbar__bar) {
  opacity: 0.8;
}

/* 子選單樣式優化 */
.aside-menu :deep(.el-sub-menu .el-menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 2px 16px;
  font-size: 13px;
}

.aside-menu :deep(.el-sub-menu .el-menu-item):before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--el-text-color-placeholder);
}

.aside-menu :deep(.el-sub-menu .el-menu-item.is-active):before {
  background-color: var(--el-color-primary);
}


.aside-menu {
  /* 🎨 基本配色 */
  --el-menu-bg-color: #ffffff;
  --el-menu-text-color: #303133;
  --el-menu-active-color: #409eff; /* 主題藍 */

  /* 🟦 hover / active 背景色（自訂變數覆蓋 Element Plus 預設） */
  --el-menu-hover-bg-color: #e8f3ff;  /* 滑過時的淺藍色 */
}
</style>