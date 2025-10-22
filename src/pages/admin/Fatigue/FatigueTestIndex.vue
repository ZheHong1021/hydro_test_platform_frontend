<template>
  <div class="admin-home">
      <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content" />設定循環次數</el-col>
        <el-col :span="8">
          <el-input v-model="formData['repeatCount']" size="large" placeholder="請輸入數值" />
        </el-col>
        <el-col :span="2">
          次
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content" />手動控制</el-col>
        <el-col :span="8"><div class="grid-content" />
          <el-button type="primary" plain>開始</el-button>
          <el-button type="primary" plain>暫停</el-button>
          <el-button type="primary" plain>結束</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-for="item in formInputList" :key="item.key" align="middle">
        <el-col :span="4">
          {{ item.title }}:
        </el-col>
        <el-col :span="8">
          <el-input v-model="formData[item.key]" size="large" placeholder="請輸入數值" />
        </el-col>
        <el-col :span="2">
          {{ item.unit }}
        </el-col>
      </el-row>

  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus, Refresh, Grape, MapLocation, TrendCharts, Money } from '@element-plus/icons-vue'

const formData = ref({
  repeatCount: null,
  currentCount: null,
  targetCount: null,
})

const formInputList = ref([
  {
    title: "現在次數",
    key: "currentCount",
    unit: "次"
  },
  {
    title: "目標次數",
    key: "targetCount",
    unit: "次"
  },
])

</script>

<style scoped>
.admin-home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>