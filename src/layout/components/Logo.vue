<script setup lang='ts'>
import useBreadcrumbStore from '@/store/module/breadcrumb';

let breadcrumbStore = useBreadcrumbStore();

</script>

<template>
  <div class="logo">
    <img src="/logo.png" alt="Logo">
    <p :hidden="breadcrumbStore.fold">一个前端平台</p>
  </div>
</template>

<style lang='scss' scoped>
.logo {
  padding: 1vh;
  display: flex;
  justify-content: center;
  height: $base_topbar_height;
  img { 
    height: 5vh;
  }
  p {
    line-height: 5vh;
    font-size: 24px;
    font-weight: bolder;
    padding: 0px 1vw;
    color: white;
  }
}

</style>
