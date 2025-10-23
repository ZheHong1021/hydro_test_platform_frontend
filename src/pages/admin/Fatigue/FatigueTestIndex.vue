<template>
  <div class="admin-home">
    <div>
      <h3>串口資料：</h3>
      <pre>{{ serial.receivedData }}</pre>
    </div>
      <el-row :gutter="20">
        <el-col :span="4"><div class="grid-content" />設定循環次數</el-col>
        <el-col :span="8">
          <el-input v-model="repeatCount" size="large" placeholder="請輸入數值" />
        </el-col>
        <el-col :span="2">
          次
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content" />
          <el-button type="primary" plain @click="onStart">開始</el-button>
          <el-button type="primary" plain @click="sendSerialCount(1)">暫停</el-button>
          <el-button type="primary" plain @click="sendSerialCount(2)">結束</el-button>
        </el-col>
      </el-row>

      <el-row :gutter="20" align="middle">
        <el-col :span="4">
          現在次數
        </el-col>
        <el-col :span="8">
          <el-input v-model="currentCount" size="large" :readonly="true"/>
        </el-col>
        <el-col :span="2">
          次
        </el-col>
      </el-row>

      <el-row :gutter="20" align="middle">
        <el-col :span="4">
          目標次數
        </el-col>
        <el-col :span="8">
          <el-input v-model="targetCount" size="large" :readonly="true"/>
        </el-col>
        <el-col :span="2">
          次
        </el-col>
      </el-row>

  </div>

</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useSerialStore } from '@/stores/serial';
import { useFatigueStore } from '@/stores/fatigue';
const serial = useSerialStore();
const fatigue = useFatigueStore();

const repeatCount = ref<number | null>(null);
const currentCount = ref<number | null>(null);
const targetCount = ref<number | null>(null);


onMounted(() => {
  sendSerialPage(); // 如果有連線，傳送頁面為 0
  if(fatigue.repeatCount !== null){
    repeatCount.value = fatigue.repeatCount;
    targetCount.value = fatigue.repeatCount;
  }
});

watch( // 監聽連線狀態變化
  () => serial.isConnected,
  (connected) => {
    if (connected) {
      sendSerialPage(); // 如果有連線，傳送頁面為 0
    }
  }
);

// 監聽 receivedData 更新
watch(
  () => serial.receivedData,
  (newData) => {
    if (!newData) return;
    // 根據資料更新表單
    currentCount.value = newData['test_no'] ? Number(newData['test_no']) : null;
  },
  { deep: true } // 保證監聽陣列內部變化
);

const sendSerialPage = async () => {
  if(serial.isConnected){
    await serial.send("SET_PAGE,1") // 如果有連線，設定頁面為 1
  }
}

const sendSerialCount = async (no: number) => {
  if(!serial.isConnected){
    return;
  }

  // 驗證 repeatCount 是否為有效數字
  const count = Number(repeatCount.value);
  if (isNaN(count) || count <= 0) {
    console.warn('循環次數必須為有效的正整數');
    return;
  }

  await serial.send(`SET_COUNT,${no},${count}`);
}

const onStart = () => { // 開始
  // 驗證 repeatCount 是否為有效數字
  const count = Number(repeatCount.value);
  if (isNaN(count) || count <= 0) {
    console.warn('請輸入有效的循環次數');
    return;
  }

  fatigue.setRepeatCount(count); // 儲存到 store
  targetCount.value = count;
  sendSerialCount(0);
}



</script>

<style scoped>
.admin-home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>