<template>
  <div class="layout-home">
    <!-- 左边的侧边栏 -->
    <div class="sidebar" :style="{ width: sidebarWidth }">
      <Sidebar @handleClose="handleClose"></Sidebar>
    </div>
    <!-- 右边的主体和头部 -->
    <!-- :style="{marginLeft:sidebarWidth}" -->
    <div class="content" :style="{ marginLeft: sidebarWidth }">
      <!-- :style="{width: `calc(100% - ${sidebarWidth})`}" -->
      <div class="header-wrap" :style="{ width: `calc(100% - ${sidebarWidth})` }">
        <div class="info">
          <div class="crumbs">
            <!-- 面包屑组件 -->
            <Breadcrumb></Breadcrumb>
          </div>
          <div class="login-out">
            <!-- 退出登录的弹出框 -->
            <el-popover
              :width="200"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <div class="user-info">
                <p style="color: #000; font-size: 16px; font-weight: 500">{{ '18888888888' }}</p>
                <div class="but">
                  <el-button
                    type="primary"
                    style="
                      margin-top: 5px;
                      height: 40px;
                      border: #f4f6f7;
                      width: 160px;
                      background-color: #f4f6f7;
                      color: #6e7885;
                    "
                    >退出登录</el-button
                  >
                </div>
              </div>
              <template #reference>
                <div class="text-info">
                  <el-avatar
                    :size="40"
                    :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
                  />
                  <span style="margin-left: 10px">{{ '18888888888' }}</span>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="content-tag">
          <TagList @reload="reloadPart"></TagList>
        </div>
      </div>
      <div class="content-wrap">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive v-if="isReloadData">
              <component :is="Component" v-if="route.meta.keepAlive" :key="route.path"></component>
            </keep-alive>
          </transition>
          <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path"></component>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import TagList from './components/TagList.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapse = ref(true) //是否展开侧边栏
// console.log(isCollapse.value);

//一种刷新的方式    //还有一种在 tegList组件中, 跳转路由来刷新
const isReloadData = ref(true) //用来刷新子路由
const reloadPart = () => {
  console.log('刷新')
  isReloadData.value = false
  // nextTick(() => {
  //   isReloadData.value = true
  // })
  setTimeout(() => {
    isReloadData.value = true
  }, 300)
}

// 是否缩放侧边栏
const handleClose = val => {
  isCollapse.value = val
}

// 计算侧边栏的宽度
const sidebarWidth = computed(() => {
  if (isCollapse.value) {
    return '70px'
  } else {
    return '200px'
  }
})
</script>

<style scoped lang="scss">
.layout-home {
  position: relative;
  width: 100%;
  min-height: 100%;
  display: flex;

  .sidebar {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background-color: #fff;
    transition: ease 0.5s;
  }

  .content {
    position: relative;
    flex: 1;
    background: rgb(244, 245, 247);
    // overflow-y: hidden;
    padding-top: 90px;
  }
}

.header-wrap {
  width: 100%;
  position: fixed;
  // z-index: 999;
  top: 0;
  transition: ease 0.5s;

  .info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 10px;
    padding-left: 40px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;

    .login-out {
      .text-info {
        color: rgb(192, 196, 204);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .user-info {
        .but {
          padding: 0 5px 20px 20px;

          .el-button {
            height: 40px;
            width: 230px;
            background-color: #f4f6f7;
            color: #6e7885;
            border: #f4f6f7;
          }
        }
      }
    }
  }

  .content-tag {
    z-index: 10;
    height: 32px;
    line-height: 32px;
    background-color: #fff;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
  }
}

.content-wrap {
  height: calc(100vh - 92px);
}


//切换路由的动画
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
