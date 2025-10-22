<template>
  <div class="error-container">
    <div class="error-content">
      <!-- 錯誤圖標 -->
      <div class="error-icon">⚠️</div>
      
      <!-- 404 標題 -->
      <h1 class="error-title">404</h1>
      
      <!-- 錯誤描述 -->
      <h2 class="error-subtitle">頁面不存在</h2>
      
      <p class="error-description">
        抱歉，您請求的頁面不存在或已被移除。
      </p>

      <!-- 返回按鈕 -->
      <button 
        @click="goHome" 
        class="home-button"
      >
        🏠 返回首頁
      </button>
      
      <!-- 或者返回上一頁 -->
      <button 
        @click="goBack" 
        class="back-button"
      >
        ← 返回上一頁
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.error-content {
  max-width: 600px;
  background: white;
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 6rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.error-title {
  font-size: clamp(4rem, 8vw, 6rem);
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-subtitle {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.error-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-button,
.back-button {
  display: inline-block;
  padding: 1rem 2rem;
  margin: 0.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.home-button {
  background: #3498db;
  color: white;
}

.home-button:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.back-button {
  background: #95a5a6;
  color: white;
}

.back-button:hover {
  background: #7f8c8d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .error-content {
    padding: 2rem 1rem;
    margin: 1rem;
  }
  
  .error-title {
    font-size: 4rem;
  }
  
  .error-subtitle {
    font-size: 1.5rem;
  }
  
  .home-button,
  .back-button {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
}
</style>