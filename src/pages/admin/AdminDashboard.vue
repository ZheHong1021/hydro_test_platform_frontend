<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>管理儀表板</h1>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">新增資料</el-button>
        <el-button :icon="Refresh">重新整理</el-button>
      </div>
    </div>

    <el-row :gutter="20" class="dashboard-stats">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="32"><Grape /></el-icon>
            </div>
            <div class="stat-info">
              <h3>總作物數</h3>
              <p class="stat-number">156</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="32"><MapLocation /></el-icon>
            </div>
            <div class="stat-info">
              <h3>田地總數</h3>
              <p class="stat-number">24</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="32"><TrendCharts /></el-icon>
            </div>
            <div class="stat-info">
              <h3>本月產量</h3>
              <p class="stat-number">2.8噸</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="32"><Money /></el-icon>
            </div>
            <div class="stat-info">
              <h3>本月收益</h3>
              <p class="stat-number">¥28,500</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="recent-activities">
      <template #header>
        <div class="card-header">
          <span>管理概覽</span>
          <el-button type="text">查看全部</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="140" />
        <el-table-column prop="crop" label="作物" width="120" />
        <el-table-column prop="field" label="田地" width="150" />
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="yield" label="預估產量" width="120" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              編輯
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, Refresh, Grape, MapLocation, TrendCharts, Money } from '@element-plus/icons-vue'

const sampleData = {
  date: '2024-09-22',
  crop: '水稻',
  field: 'A區第1田',
  status: '生長中',
  yield: '2.5噸',
}

const tableData = ref(Array.from({ length: 8 }, (_, index) => ({
  ...sampleData,
  date: `2024-09-${(index + 15).toString().padStart(2, '0')}`,
  crop: ['水稻', '玉米', '番茄', '高麗菜'][index % 4],
  field: `${String.fromCharCode(65 + (index % 3))}區第${(index % 5) + 1}田`,
  status: ['生長中', '收成期', '準備期', '休耕'][index % 4],
  yield: `${(Math.random() * 3 + 1).toFixed(1)}噸`,
})))

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    '生長中': 'success',
    '收成期': 'warning',
    '準備期': 'info',
    '休耕': 'info'
  }
  return statusMap[status] || 'info'
}

const handleEdit = (index: number, row: any) => {
  console.log('編輯:', index, row)
}

const handleDelete = (index: number, row: any) => {
  console.log('刪除:', index, row)
}
</script>

<style scoped>
.admin-dashboard {
  padding: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.dashboard-stats {
  margin-bottom: 24px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background-color: var(--el-color-primary-light-9);
  border-radius: 12px;
  color: var(--el-color-primary);
}

.stat-info h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  font-weight: normal;
}

.stat-number {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.recent-activities {
  margin-top: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-weight: 600;
  font-size: 16px;
}
</style>