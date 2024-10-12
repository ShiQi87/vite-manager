<script setup lang='ts'>
import Logo from '@/layout/components/Logo.vue';
import { ElScrollbar, ElMenu } from 'element-plus';
import MyMenu from '@/layout/components/MyMenu.vue';
import { useRoute } from 'vue-router';
import useUserStore from '@/store/module/user';
import Topbar from '@/layout/components/topbar/index.vue';
import useTopbarStore from '@/store/module/topbar';
import MyMain from '@/layout/components/MyMain.vue'

const $route = useRoute();
let userStore = useUserStore();
let topbarStore = useTopbarStore();
</script>

<template>
  <div class="layout_container">
    <div class="layout_sidebar" :class="{ fold: topbarStore.fold }">
      <logo />
      <el-scrollbar class="scrollbar">
        <el-menu :collapse="topbarStore.fold" :defaultActive="$route.path" background-color="#001529" text-color="white">
          <my-menu :menuList="userStore.menuRoutes"  />
        </el-menu>   
      </el-scrollbar>
    </div>
    <div class="layout_topbar":class="{ fold: topbarStore.fold }">
      <topbar></topbar>
    </div>
    <div class="layout_main" :class="{ fold: topbarStore.fold }">
      <my-main />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  background-color: white;
  display: flex;
  align-items: end;
  .layout_sidebar {
    width: $base_width;
    height: 100vh;
    background-color: #001529;
    transition: all 0.3s;
    .scrollbar{
      width: 100%;
      height: calc(100vh - $base_topbar_height);
      .el-menu {
        border: none;
      }
    }
    &.fold{
      width: $base_collapse_menu_width;
    }
  }
  .layout_topbar {
    height: $base_topbar_height;
    width: calc(100% - $base_width);
    position: absolute;
    top: 0;
    left: $base_width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base_collapse_menu_width);
      left: $base_collapse_menu_width;
    }
  }
  .layout_main {
    height: calc(100vh - $base_topbar_height);
    width: calc(100% - $base_width);
    flex-grow: 1;//响应式填充
    overflow: auto;
    padding: 20px;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base_collapse_menu_width);
      left: $base_collapse_menu_width;
    }
  }
}
</style>
