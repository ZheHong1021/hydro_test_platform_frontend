<template>
  <div class="admin-home">
      <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content" />手動控制</el-col>
        <el-col :span="8"><div class="grid-content" />
          <el-button type="primary" plain>前進</el-button>
          <el-button type="primary" plain>後退</el-button>
          <el-button type="primary" plain>停止</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-for="item in formInputList" :key="item.key" align="middle">
        <el-col :span="4">
          {{ item.title }}:
        </el-col>
        <el-col :span="8">
          <el-input v-model="formData[item.key as keyof FormData]" size="large" :readonly="item.readonly"  />
        </el-col>
        <el-col :span="2">
          {{ item.unit }}
        </el-col>
      </el-row>

  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface FormData { // 定義表單資料結構
  loadOutput: number | null
  currentPosition: number | null
  loadPressureA: number | null
  loadPressureB: number | null
  testObjectPressureA: number | null
  testObjectPressureB: number | null
  pumpPressure: number | null
}

const formData = ref<FormData>({
  loadOutput: null,
  currentPosition: null,
  loadPressureA: null,
  loadPressureB: null,
  testObjectPressureA: null,
  testObjectPressureB: null,
  pumpPressure: null
})

const formInputList = ref([
  {
    title: "負載出力", // 對應標題
    key: "loadOutput", // 對應 formData 的 key
    unit: "N", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "現在位置", // 對應標題
    key: "currentPosition", // 對應 formData 的 key
    unit: "mm", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "負載油壓A", // 對應標題
    key: "loadPressureA", // 對應 formData 的 key
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "負載油壓B", // 對應標題
    key: "loadPressureB", // 對應 formData 的 key
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "測物油壓A", // 對應標題
    key: "testObjectPressure // 對應 formData 的 keyA",
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "測物油壓B", // 對應標題
    key: "testObjectPressure // 對應 formData 的 keyB",
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "泵浦油壓", // 對應標題
    key: "pumpPressure", // 對應 formData 的 key
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
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