<script setup lang='ts'>
import Breadcrumb from './Breadcrumb.vue'
import FuncMenu from './FuncMenu.vue';
</script>

<template>
  <div class="topbar">
    <div class="topbar_left">
      <breadcrumb />
    </div>
    <div class="topbar_right">
      <func-menu />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.topbar {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid black;
  .topbar_left {
    display: flex;
    align-items: center;
    margin: 0 20px;
  } 
  .topbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
