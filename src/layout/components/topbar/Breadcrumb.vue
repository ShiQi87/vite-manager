<script setup lang='ts'>
import useBreadcrumbStore from '@/store/module/breadcrumb';
import { useRoute } from 'vue-router';

let breadcrumbStore = useBreadcrumbStore(); 
let $route = useRoute();
console.log($route);
const changeIcon = () => {
  breadcrumbStore.fold = !breadcrumbStore.fold;
}
</script>

<template>
  <el-icon class="fold" @click="changeIcon">
    <component :is="breadcrumbStore.fold ? 'Fold' : 'Expand'">
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
