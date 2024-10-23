<template>
  <div class="router-tag">
    <template v-for="(item, index) in state.tagList" :key="item.path">
      <!-- contextmenu事件是右键点击  用prevent来阻止默认行为,来自己操作-->
      <div class="tag-item" :class="{ active: isActive(item) }" @contextmenu.prevent="openMenu(item, $event)">
        <span class="title" @click="toRoute(item.path)">{{ item.title }}</span>
        <el-icon class="close-icon" v-if="index !== 0" @click="closeTag(index)">
          <Close></Close>
        </el-icon>
      </div>
    </template>
    <!-- 右键弹窗 -->
    <div class="contextmenu" v-show="menu.visible" :style="{ left: menu.left + 'px', top: menu.top + 'px' }">
      <div class="menuItem" @click="refreshSelectedTag">刷新</div>
      <div class="menuItem" v-if="menu.selectedTag.path !== '/'" @click="closeSelectedTag">关闭</div>
      <div class="menuItem" @click="closeOthersTags">关闭其他</div>
      <div class="menuItem" @click="closeAllTags">关闭所有</div>
    </div>
    <!-- taglist{{ state.tagList[0].title }} -->
  </div>
</template>

<script setup>
import { useTagStore } from '@/stores/index.js'
import { storeToRefs } from 'pinia'
import { nextTick, getCurrentInstance, reactive, watch } from 'vue'
import { Close } from '@element-plus/icons-vue'

import { useRoute, useRouter } from 'vue-router'
const emit = defineEmits(['reload'])
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
// 右键菜单的定位
const menu = reactive({
  top: 0,
  left: 0,
  visible: false, //右键点击显示的标签
  selectedTag: {} //选中的标签
})
const isActive = item => {
  return route.path === item.path
}

const tagStore = useTagStore()
const { state } = storeToRefs(tagStore)
const { delTagItem, setTagItem, delOthersTags, delALlTags } = tagStore

// 监听路由 每次切换都新增
watch(route, to => {
  // console.log(to.path);
  // const str = '/redirect/test-2';
  // 用slplit来切割字符串  如果路由为redirect 的话代表进入刷新  不需要添加标签
  const parts = to.path.split('/')
  const redirect = parts[1]
  if (redirect == 'redirect') return
  // console.log(redirect); // 输出 "redirect"
  // setTagItem(to)
  setTags(to)
})

const setTags = to => {
  // 判断是否重复添加
  const isExits = state.value.tagList.find(item => item.path === to.path)
  // console.log(isExits);
  // 如过isExits有值代表 已经添加过,不需要再添加
  if (!isExits) {
    const tag = {
      // path: to.path,
      path: to.fullPath,
      title: to.meta.title
    }
    setTagItem(tag)
  }
}
// 点击跳转路由
const toRoute = path => {
  router.push({
    path
  })
}

//删除标签
const closeTag = index => {
  // 删除的标签
  const delItem = state.value.tagList[index]
  // 调用pinna删除该标签
  delTagItem(index)
  //如果删除的当前路由的标签, 跳转到最后一个标签
  // if (delItem.path === route.path) {
  if (isActive(delItem)) {
    const lastItem = state.value.tagList[state.value.tagList.length - 1]
    router.push(lastItem.path)
  } else {
    // router.push('/')
  }
}
// 关闭右键的标签
const cloesMenu = () => {
  menu.visible = false
}
// 监听是否打开标签, 如果点击打开了 右键标签 就给body添加事件关闭 标签
watch(
  () => menu.visible,
  val => {
    window.addEventListener('click', cloesMenu)
  }
)
// 右键点击标签 打开
const openMenu = (tag, e) => {
  // console.log(tag, e);
  const menuMinWidth = 105
  // proxy.$el 代表当前页面最外层template的dom元素 也就是 router-tag的dom
  // console.log(proxy.$el.getBoundingClientRect().left,app.getBoundingClientRect().left);
  // console.log(proxy.$el);
  const offsetLeft = proxy.$el.getBoundingClientRect().left // 视窗的左边距
  const offsetWidth = proxy.$el.offsetWidth // 宽度
  const maxLeft = offsetWidth - menuMinWidth // 最大的左边距
  const left = e.clientX - offsetLeft + 15 // 15: margin right
  // 如果鼠标点击位置的左边距离大于左边界，则将菜单的左边距离设置为左边界，否则设置为鼠标点击位置的左边距离
  if (left > maxLeft) {
    menu.left = maxLeft
  } else {
    menu.left = left
  }
  // 最后设置菜单的顶部位置为鼠标点击位置的纵坐标
  menu.top = e.clientY + 15
  // 将菜单设置为可见状态
  menu.visible = true
  // 并将选中的标签设置为传入的tag
  menu.selectedTag = tag
}

//刷新选中的标签
const refreshSelectedTag = () => {
  console.log('刷新')
  emit('reload')

  // nextTick(() => {
  //   router.replace({
  //     path: '/redirect' + menu.selectedTag.path
  //   }).catch(err => {
  //     console.warn(err)
  //   })
  // })
}
// 关闭选中的标签
const closeSelectedTag = () => {
  console.log('关闭当前标签')
  if (menu.selectedTag.title === null) return
  const index = state.value.tagList.findIndex(item => {
    // console.log(item.title, menu.selectedTag.title);
    return item.title === menu.selectedTag.title
  })
  // console.log(index);
  // index不等于-1代表找到了index  直接调用pinna删除标签
  index > -1 && delTagItem(index)
  // 如果删除的标签是最后一个,  再次跳转到最后一个标签
  if (isActive(menu.selectedTag)) {
    const lastItem = state.value.tagList[state.value.tagList.length - 1]
    router.push(lastItem.path)
  }
}
// 关闭其他标签
const closeOthersTags = () => {
  console.log('关闭其他标签')
  // 找到选中标签的索引
  const index = state.value.tagList.findIndex(item => {
    // console.log(item.title, menu.selectedTag.title);
    return item.title === menu.selectedTag.title
  })
  index > -1 && delOthersTags(index)
  // 跳转到选中的标签
  router.push(menu.selectedTag.path)
  // delOthersTags()
}
// 关闭所有标签
const closeAllTags = () => {
  console.log('关闭所有标签')
  delALlTags()
  router.push('/')
}
</script>

<style lang="scss">
.router-tag {
  display: flex;
  align-items: center;
  overflow-x: auto;

  .tag-item {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    height: 26px;
    line-height: 25px;
    border: 1px solid rgba(124, 141, 181, 0.3);
    border-radius: 4px;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    margin-bottom: 4px;
    box-sizing: border-box;

    .title {
      padding: 0 8px;
      white-space: nowrap;
    }

    .close-icon:hover {
      background-color: #d4d4d4;
      border-radius: 50%;
    }
  }

  .active {
    background: #0960bd;
    border: 0;
    transition: none;
    color: #fff;
  }
}

.contextmenu {
  position: absolute;
  margin: 0;
  background-color: #fff;
  z-index: 999 !important;
  padding: 5px 0;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 300;
  color: #333;

  .menuItem {
    margin: 0;
    padding: 5px 16px;
    cursor: pointer;

    &:hover {
      background-color: #eee;
    }
  }
}

/* // 滚动条整体宽度 */
::-webkit-scrollbar {
  // width: 8px !important;
  // height: 12px !important;
  height: 3px !important;
  width: 2px !important;
}

/* // 滚动条滑槽样式 */
::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

/* // 滚动条样式 */
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: #ddd;
  -webkit-box-shadow: inset 0 0 6px #e4e4e4;
}

::-webkit-scrollbar-thumb:hover {
  background: #e4e4e4;
}

::-webkit-scrollbar-thumb:active {
  background: #e4e4e4;
}

/* // 浏览器失焦的样式 */
::-webkit-scrollbar-thumb:window-inactive {
  background: #e4e4e4;
}
</style>
