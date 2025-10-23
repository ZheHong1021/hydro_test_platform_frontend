import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

export const useFatigueStore = defineStore('fatigue', () => {
  const repeatCount = ref(null);

  const setRepeatCount = (count) => {
    repeatCount.value = count;
  };

  return { repeatCount, setRepeatCount }
},
  { // 啟用持久化
    persist: true,
  });
