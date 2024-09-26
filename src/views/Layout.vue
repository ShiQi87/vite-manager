<script setup lang='ts'>
import Logo from '@/components/Logo.vue'
</script>

<template>
  <div class="layout_container">
    <div class="layout_sidebar">
      <logo />
    </div>
    <div class="layout_topbar"></div>
    <div class="layout_main">
      <span>a</span>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.layout_container {
  width: 100%;
  height: 100vh;
  background-color: aqua;
  display: flex;
  align-items: end;
  .layout_sidebar {
    width: $base_width;
    height: 100vh;
    background-color: white;
  }
  .layout_topbar {
    height: $base_topbar_height;
    width: calc(100% - $base_width);
    background-color: purple;
    position: absolute;
    top: 0;
    left: $base_width;
  }
  .layout_main {
    height: calc(100vh - $base_topbar_height);
    width: calc(100% - $base_width);
    background-color: red;
    flex-grow: 1;//响应式填充
    overflow: auto;
    padding: 20px;
    span{
      height: 10000px;
      background-color: pink;
      display: block;
    }
  }
}
</style>
