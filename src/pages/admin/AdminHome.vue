<template>
  <div class="admin-home">
      <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content" />手動控制</el-col>
        <el-col :span="8"><div class="grid-content" />
          <el-button type="primary" plain @click="sendSerialButton(0)">前進</el-button>
          <el-button type="primary" plain @click="sendSerialButton(1)">後退</el-button>
          <el-button type="primary" plain @click="sendSerialButton(2)">停止</el-button>
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
import { ref, onMounted, watch   } from 'vue'
import { ElLoading } from 'element-plus'

// //#region (Web Serial API 相關)
import { useSerialStore } from '@/stores/serial';

// 連線狀態管理
const serial = useSerialStore();

watch( // 監聽連線狀態變化
  () => serial.isConnected,
  (connected) => {
    if (connected) {
      const loading = ElLoading.service({
        lock: true,
        text: '等待設備連線初始化中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      setTimeout(() => {
        sendSerialPage(); // 如果有連線，傳送頁面為 0
        loading.close()
      }, 3000);
    }
  }
);

// 監聽 receivedData 更新
watch(
  () => serial.receivedData,
  (newData) => {
    if (!newData) return;
    // 根據資料更新表單
    formData.value.stroke = newData['stroke'] ? Number(newData['stroke']) : null;
    formData.value.press1_a = newData['press1_a'] ? Number(newData['press1_a']) : null;
    formData.value.press1_b = newData['press1_b'] ? Number(newData['press1_b']) : null;
    formData.value.press2_a = newData['press2_a'] ? Number(newData['press2_a']) : null;
    formData.value.press2_b = newData['press2_b'] ? Number(newData['press2_b']) : null;
    formData.value.press3 = newData['press3'] ? Number(newData['press3']) : null;
  },
  { deep: true } // 保證監聽陣列內部變化
);
//#endregion

const sendSerialPage = async () => {
  if(serial.isConnected){
    await serial.send("SET_PAGE,0") // 如果有連線，設定頁面為 0
  }
}

const sendSerialButton = async (no: number) => {
  await serial.send(`SET_BUTTON,${no}`) // 如果有連線，設定按鈕指令
}


onMounted(() => {
  sendSerialPage(); // 如果有連線，傳送頁面為 0
});



interface FormData { // 定義表單資料結構
  loadOutput: number | null
  stroke: number | null
  press1_a: number | null
  press1_b: number | null
  press2_a: number | null
  press2_b: number | null
  press3: number | null
}

const formData = ref<FormData>({
  loadOutput: null,
  stroke: null,
  press1_a: null,
  press1_b: null,
  press2_a: null,
  press2_b: null,
  press3: null
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
    key: "stroke", // 對應 formData 的 key
    unit: "mm", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "負載油壓A", // 對應標題
    key: "press1_a", // 對應 formData 的 key
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "負載油壓B", // 對應標題
    key: "press1_b", // 對應 formData 的 key
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "測物油壓A", // 對應標題
    key: "press2_a", // 對應 formData 的 keyA",
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "測物油壓B", // 對應標題
    key: "press2_b", // 對應 formData 的 keyB",
    unit: "psi", // 顯示單位
    readonly: true, // 全部都唯讀
  },
  {
    title: "泵浦油壓", // 對應標題
    key: "press3", // 對應 formData 的 key
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