<script setup lang='ts'>
import Logo from '@/layout/components/Logo.vue';
import { ElScrollbar, ElMenu } from 'element-plus';
import MyMenu from '@/layout/components/MyMenu.vue';
import { RouterView, useRoute } from 'vue-router';
import useUserStore from '@/store/module/user';
import Topbar from '@/layout/components/topbar/index.vue';
import useBreadcrumbStore from '@/store/module/breadcrumb';

const $route = useRoute();
let userStore = useUserStore();
let breadcrumbStore = useBreadcrumbStore();
</script>

<template>
  <div class="layout_container">
    <div class="layout_sidebar" :class="{ fold: breadcrumbStore.fold }">
      <logo />
      <el-scrollbar class="scrollbar">
        <el-menu :collapse="breadcrumbStore.fold" :defaultActive="$route.path" background-color="#001529" text-color="white">
          <my-menu :menuList="userStore.menuRoutes"  />
        </el-menu>   
      </el-scrollbar>
    </div>
    <div class="layout_topbar":class="{ fold: breadcrumbStore.fold }">
      <topbar></topbar>
    </div>
    <div class="layout_main" :class="{ fold: breadcrumbStore.fold }">
      <router-view></router-view>
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
