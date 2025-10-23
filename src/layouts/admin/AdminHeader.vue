<template>
  <el-header class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <!-- 連線狀態區域 -->
        <div class="connection-status-header">
          <el-space :size="8" direction="vertical" alignment="center">
            <el-space :size="4">
              <el-text size="small">連線狀態：</el-text>
              <el-text
                size="small"
                :type="serial.isConnected ? 'success' : 'danger'"
                tag="strong"
              >
                {{ serial.isConnected ? '已連線' : '未連線' }}
              </el-text>
            </el-space>
            <el-space :size="8">
              <el-button
                type="primary"
                size="small"
                @click="onConnect"
                :disabled="serial.isConnected"
                plain
              >
                連線
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="onDisconnect"
                :disabled="!serial.isConnected"
                plain
              >
                中斷
              </el-button>
            </el-space>
          </el-space>
        </div>
        <div class="logo">
          <h2>油壓測試平台</h2>
        </div>
      </div>
      <div class="header-right">
        

        <!-- 通知中心 -->
        <el-dropdown @command="handleNotificationAction">
          <el-button type="text" class="action-btn">
            <el-icon size="18"><Bell /></el-icon>
            <el-badge :value="notificationCount" :hidden="notificationCount === 0" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>
                <div class="notification-header">
                  通知中心 ({{ notificationCount }})
                </div>
              </el-dropdown-item>
              <el-dropdown-item
                v-for="notification, index in notifications"
                :key="notification.id"
                :command="notification.path"
                :divided="index === 0">
                <el-icon><Sunny /></el-icon>
                新增疲勞測試頁面
              </el-dropdown-item>
              <el-dropdown-item divided command="/notifications">
                查看全部通知
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 用戶選單 -->
        <el-dropdown @command="handleUserAction">
          <div class="user-info">
            <el-avatar :size="32" :icon="UserFilled" />
            <div class="user-details">
              <span class="username">{{ username }}</span>
            </div>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <!-- <el-dropdown-menu>
              <el-dropdown-item 
                v-for="action in userActions"
                :key="action.command"
                :command="action.command"
                :icon="action.icon"
                :divided="action.command === 'logout'">
                {{ action.label }}
              </el-dropdown-item>
            </el-dropdown-menu> -->
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserFilled,
  Bell,
  ArrowDown,
  Sunny,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useSerialStore } from '@/stores/serial';

const router = useRouter()

const username = ref('系統管理員')



const notifications = ref([
  {
    id: 1,
    type: 'feature',
    message: '新增疲勞測試頁面',
    path: '/fatigue-test',
  },
])

const notificationCount = computed(() => notifications.value.length)


const handleNotificationAction = (path: string) => {
  router.push(path)
}



// const userActions = ref([
//   { command: 'profile', label: '個人資料', icon: User },
//   { command: 'logout', label: '登出', icon: SwitchButton },
// ])

const handleUserAction = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      ElMessage.success('已登出')
      // router.push('/login')
      break
  }
}

//#region (Web Serial API 相關)
// 連線狀態管理
const serial = useSerialStore();

// 連線方法
const onConnect = async () => {
    await serial.connect()
}


// 中斷連線方法
const onDisconnect = async () => {
    await serial.disconnect();
}
//#endregion


</script>

<style scoped>
.admin-header {
  background-color: var(--el-color-white);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  min-width: 200px;
}

.logo h2 {
  margin: 0;
  color: var(--el-color-primary);
  font-weight: 600;
  font-size: 18px;
}




.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.connection-status-header {
  padding: 8px 12px;
  background-color: var(--el-bg-color-page);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
}


.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--el-color-primary-light-9);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}


.dropdown-icon {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.notification-header {
  font-weight: 600;
  color: var(--el-text-color-primary);
  text-align: center;
}

/* 搜尋框樣式 */
.search-area :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
  border-radius: 20px;
}

.search-area :deep(.el-input__wrapper):hover {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

.search-area :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) inset;
}

/* 響應式調整 - 平板以下 */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 16px;
  }

  .search-area {
    max-width: 250px;
  }

  .user-details {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-center {
    display: none;
  }

  .header-left {
    flex: 2;
  }
}
</style>