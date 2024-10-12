<script setup lang='ts'>
import useTopbarStore from '@/store/module/topbar';
import { useRoute } from 'vue-router';

let topbarStore = useTopbarStore(); 
let $route = useRoute();
const changeIcon = () => {
  topbarStore.fold = !topbarStore.fold;
}
</script>

<template>
  <el-icon class="fold" @click="changeIcon">
    <component :is="topbarStore.fold ? 'Fold' : 'Expand'">
    </component>
  </el-icon>
  <!-- 面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <el-icon class="icon">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style lang='scss' scoped>
.fold {
  margin: 10px;
  &:hover{
    cursor: pointer;
  }
}
.icon{
  margin-right: 5px;
}
</style>
