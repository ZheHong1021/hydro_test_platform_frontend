<template>
  <template v-for="item in menuItems" :key="item.index">
    <!-- 有子選單的項目 -->
    <el-sub-menu v-if="item.children" :index="item.index">
      <template #title>
        <el-icon>
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item
        v-for="child in item.children"
        :key="child.index"
        :index="child.index"
      >
        {{ child.title }}
      </el-menu-item>
    </el-sub-menu>

    <!-- 無子選單的項目 -->
    <el-menu-item v-else :index="item.index">
      <el-icon>
        <component :is="item.icon" />
      </el-icon>
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
interface MenuItem {
  index: string
  title: string
  icon: any
  children?: MenuItem[]
}

interface Props {
  menuItems: MenuItem[]
}

defineProps<Props>()
</script>