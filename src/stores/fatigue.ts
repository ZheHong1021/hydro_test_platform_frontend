import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFatigueStore = defineStore('fatigue', () => {
  const repeatCount = ref<number | null>(null);

  const setRepeatCount = (count: number | null) => {
    repeatCount.value = count;
  };

  return { repeatCount, setRepeatCount }
},
  { // 啟用持久化
    persist: true,
  });
