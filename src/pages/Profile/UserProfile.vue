<template>
  <div class="profile-edit">
    <div class="page-header">
      <h1>個人資料編輯</h1>
    </div>

    <div class="profile-form">
      <el-form :model="profileForm" label-position="top">
        <el-form-item label="姓名">
          <el-input v-model="profileForm.name" placeholder="請輸入姓名" />
        </el-form-item>

        <el-form-item label="電子郵件">
          <el-input v-model="profileForm.email" placeholder="請輸入電子郵件" />
        </el-form-item>

        <el-form-item label="電話號碼">
          <el-input v-model="profileForm.phone" placeholder="請輸入電話號碼" />
        </el-form-item>

        <el-form-item label="農場名稱">
          <el-input v-model="profileForm.farmName" placeholder="請輸入農場名稱" />
        </el-form-item>

        <el-form-item label="農場地址">
          <el-input v-model="profileForm.farmAddress" placeholder="請輸入農場地址" />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" @click="saveProfile">儲存資料</el-button>
          <el-button @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  farmName: '',
  farmAddress: ''
})

const saveProfile = () => {
  // TODO: 實作儲存邏輯
  ElMessage.success('資料儲存成功')
}

const resetForm = () => {
  profileForm.value = {
    name: '',
    email: '',
    phone: '',
    farmName: '',
    farmAddress: ''
  }
}
</script>

<style scoped>
.profile-edit {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.profile-form {
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

@media (max-width: 768px) {
  .profile-edit {
    padding: 16px;
  }
  
  .profile-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}
</style>