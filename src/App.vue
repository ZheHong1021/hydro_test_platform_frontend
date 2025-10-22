<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
// App.vue 現在只作為路由容器
// Layout的選擇由路由系統決定
</script>

<style>
/* 全局樣式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

/* Element Plus 全局樣式調整 */
.el-container {
  height: 100%;
}

.el-main {
  padding: 0;
}

/* 滾動條樣式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 針對不同設備的全局調整 */
@media (max-width: 767px) {
  /* 手機版全局樣式 */
  .el-button {
    min-height: 32px;
  }

  .el-input {
    font-size: 16px; /* 防止iOS自動縮放 */
  }

  .el-dialog {
    width: 95% !important;
    margin: 0 auto;
    top: 5vh;
  }

  .el-message-box {
    width: 90% !important;
  }
}

@media (max-width: 1024px) and (min-width: 768px) {
  /* 平板版全局樣式 */
  .el-dialog {
    width: 80% !important;
  }
}

/* 確保觸控友好的按鈕尺寸 */
@media (pointer: coarse) {
  .el-button {
    min-height: 44px;
    padding: 12px 20px;
  }

  .el-button--small {
    min-height: 36px;
    padding: 8px 16px;
  }
}

/* Loading 動畫優化 */
.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}

/* 表格響應式優化 */
.el-table {
  font-size: 14px;
}

@media (max-width: 767px) {
  .el-table {
    font-size: 12px;
  }

  .el-table .cell {
    padding: 0 8px;
  }

  .el-table th {
    padding: 8px 0;
  }

  .el-table td {
    padding: 8px 0;
  }
}

/* 表單響應式優化 */
@media (max-width: 767px) {
  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item__label {
    font-size: 14px;
  }
}

/* 確保頁面不會出現意外的滾動 */
.router-view {
  height: 100vh;
  overflow: hidden;
}

/* 過渡動畫 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* iOS Safari 底部安全區域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-safe-area {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
