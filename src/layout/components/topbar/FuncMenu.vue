<script setup lang='ts'>
import useTopbarStore from '@/store/module/topbar';
import useUserStore from '@/store/module/user';
import * as path from 'path';
import { useRouter, useRoute } from 'vue-router';

const topbarStore = useTopbarStore();
const userStore = useUserStore();
const $router = useRouter()
const $route = useRoute()

const refresh = () => {
  topbarStore.refresh = !topbarStore.refresh;
}

const changeFullScreen = () => {
  let full = document.fullscreenElement;
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
const logout = async () => {
  await userStore.userLogout();
  $router.push({ path: '/login', query:{ redirect: $route.path } });
}
</script>

<template>
  <div class="topbar_right">
    <el-button size="small" icon="Refresh" :circle="true" @click="refresh"></el-button>
    <el-button size="small" icon="FullScreen" :circle="true" @click="changeFullScreen"></el-button>
    <el-button size="small" icon="Setting" :circle="true"></el-button>
    <img :src="userStore.avatar" class="tou">
    <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  </div>
</template>

<style lang='scss' scoped>
.tou {
  width: 24px;
  height: 24px;
  margin: 0 10px;
  border-radius: 50%;
} 
.el-icon--right {
  margin-right: 20px;
}
</style>
