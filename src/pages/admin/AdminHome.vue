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
          <el-input v-model="formData[item.key as keyof FormData]" size="large" :suffix="item.unit" placeholder="請輸入數值" />
        </el-col>
        <el-col :span="2">
          {{ item.unit }}
        </el-col>
      </el-row>

  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface FormData {
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
    title: "負載出力",
    key: "loadOutput",
    unit: "N"
  },
  {
    title: "現在位置",
    key: "currentPosition",
    unit: "mm"
  },
  {
    title: "負載油壓A",
    key: "loadPressureA",
    unit: "psi"
  },
  {
    title: "負載油壓B",
    key: "loadPressureB",
    unit: "psi"
  },
  {
    title: "測物油壓A",
    key: "testObjectPressureA",
    unit: "psi"
  },
  {
    title: "測物油壓B",
    key: "testObjectPressureB",
    unit: "psi"
  },
  {
    title: "泵浦油壓",
    key: "pumpPressure",
    unit: "psi"
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