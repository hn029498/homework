<template>
  <div class="home-container">
    <i-menu clas="home-menu" :active-name="activeValue" @on-select="handleMenuItemSelect">
      <menu-group title="TS作业">
        <menu-item v-for="item in menuList" :name="item.value">
          {{ item.label }}
        </menu-item>
      </menu-group>
    </i-menu>
    <div class="home-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,getCurrentInstance } from 'vue';

export default defineComponent({
  setup() {
    // 获取全局方法
    const _this = getCurrentInstance().appContext.config.globalProperties;

    let activeValue = ref('3')
    const menuList:object = {
      1: {
        label: '学分记录',
        value: '1',
        path: '/lesson1'
      },
      2: {
        label: '矛盾管理',
        value: '2',
        path: '/lesson2'
      },
      3: {
        label: '任务管理',
        value: '3',
        path: '/lesson3'
      },
      4: {
        label: '目标管理',
        value: '4',
        path: '/lesson4'
      },
      5: {
        label: '商品搜索',
        value: '5',
        path: '/lesson5'
      }
    }
    let handleMenuItemSelect = (name) => {
      _this.$router.push({path: menuList[name].path})
    }
    return {
      activeValue,
      menuList,
      handleMenuItemSelect
    }
  }
})
</script>
<style scoped lang="less">
.read-the-docs {
  color: #888;
}
.home-container{
  display: flex;
}
.home-menu{
  height: 100vh;
  overflow-y: auto;
}
.home-content{
  padding: 20px;
  width: 100%;
}
</style>
