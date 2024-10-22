<template>
  <div class="breadcrumb">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
        <!-- {{ item.meta.title }} -->
        <span v-if="item.redirect === 'noredirect' || index === breadcrumbs.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const breadcrumbs = ref([])
const route = useRoute()
const router = useRouter()
watch(
  () => route.path,
  () => {
    getBreadcrumbs()
  }
)
// 获取面包屑的数据
const getBreadcrumbs = () => {
  // console.log(route.matched);
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const frist = matched[0]
  // console.log(frist);
  // console.log(!isDashboard(frist));
  if (!isDashboard(frist)) {
    matched = [
      {
        path: '/',
        meta: {
          title: '首页'
        }
      }
    ].concat(matched)
  }
  breadcrumbs.value = matched.filter(item => item.meta && item.meta.title)
  // console.log(breadcrumbs.value);
}
// 判断是不是首页
const isDashboard = route => {
  const name = route && route.name
  // console.log(name);
  if (!name) {
    return false
  }
  return name.toString().trim().toLocaleLowerCase() === '/initThree'.toLocaleLowerCase()
}
// 跳转路由
const handleLink = item => {
  if (item.redirect) {
    router.push(item.redirect)
  } else {
    router.push(item.path)
  }
}
onBeforeMount(() => {
  getBreadcrumbs()
})
</script>

<style scoped lang="scss">
.no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
