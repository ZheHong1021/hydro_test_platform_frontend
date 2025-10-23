<template>
  <el-footer class="admin-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="copyright">
          © {{ currentYear }} 本網站為航太科技應用研發組版權所有，未經允許，不得以任何形式複製和採用
        </span>
      </div>



      <div class="footer-right">

        <el-divider direction="vertical" />

        <div class="performance-info">
          <span class="performance-item">時間: {{ currentTime }}</span>
        </div>
      </div>
    </div>
  </el-footer>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
const currentTime = ref('')

// 格式化時間顯示
const formatTime = (date: Date) => {
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hours = ('0' + date.getHours()).slice(-2)
  const minutes = ('0' + date.getMinutes()).slice(-2)
  const seconds = ('0' + date.getSeconds()).slice(-2)
  
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

// 更新當前時間
const updateCurrentTime = () => {
  currentTime.value = formatTime(new Date())
}

// 時間更新監控
onMounted(() => {
  // 初始化時間顯示
  updateCurrentTime()
  
  // 每秒更新時間
  setInterval(() => {
    updateCurrentTime()
  }, 1000)
})
</script>

<style scoped>
.admin-footer {
  background-color: var(--el-color-white);
  border-top: 1px solid var(--el-border-color-light);
  padding: 0;
  height: 60px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.02);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.footer-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.copyright {
  color: var(--el-text-color-regular);
  font-size: 13px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
}

.performance-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.performance-item {
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}

/* 響應式調整 */
@media (max-width: 1024px) {
  .footer-content {
    padding: 0 20px;
  }

  .performance-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    height: auto;
    padding: 12px 16px;
    gap: 8px;
  }

  .footer-right {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .footer-right {
    flex-direction: column;
    gap: 4px;
  }
}
</style>