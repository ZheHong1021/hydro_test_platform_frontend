<template>
  <el-container class="admin-layout" direction="vertical">
    <AdminHeader />

    <el-container class="admin-main-container">
      <AdminAside ref="asideRef" />

      <el-container direction="vertical" class="content-container">
        <AdminMain class="main-content">
          <RouterView />
        </AdminMain>

        <AdminFooter />
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import AdminHeader from './AdminHeader.vue'
import AdminAside from './AdminAside.vue'
import AdminMain from './AdminMain.vue'
import AdminFooter from './AdminFooter.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.admin-main-container {
  flex: 1;
  overflow: hidden;
}

.content-container {
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: auto;
}

/* 響應式設計 - PC優先 */
@media (max-width: 1024px) {
  .admin-layout {
    min-width: 1024px;
    overflow-x: auto;
  }
}

/* 確保表格和內容在PC上有足夠空間 */
:deep(.el-table) {
  font-size: 14px;
}

/* 優化容器布局 */
:deep(.el-container) {
  height: 100%;
}

:deep(.el-aside) {
  overflow: hidden;
}

:deep(.el-header) {
  padding: 0;
  height: auto;
}

:deep(.el-footer) {
  padding: 16px 24px;
  background-color: var(--el-bg-color-page);
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>