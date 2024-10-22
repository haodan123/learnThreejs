<template>
  <el-config-provider>
    <BaseHeader />
    <div class="main-container">
      <BaseSide />
      <div class="mian-content">
        <!-- <HelloWorld msg="Hello Vue 3 + Element Plus + Vite" /> -->
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import BaseHeader from './components/BaseHeader.vue'
import BaseSide from './components/BaseSide.vue'
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<style>
#app {
  text-align: center;
  color: var(--el-text-color-primary);
}
.mian-content {
  width: 100%;
  padding-block: 10px;
}

.main-container {
  height: calc(100vh - var(--el-menu-item-height) - 6px);
  display: flex;
}
</style>
