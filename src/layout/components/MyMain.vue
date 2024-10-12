<script setup lang='ts'>
import { RouterView } from 'vue-router';
import { ref, nextTick } from 'vue';
import useTopbarStore from '@/store/module/topbar';

let flag = ref(true);
let topbarStore = useTopbarStore();

topbarStore.$subscribe((mutation, store) => {
  if (store.refresh == store.refresh) {
    flag.value = false;
    nextTick(() => {
      flag.value = true;
      console.log('shuaxin');
    });
  }
});

</script>

<template>
    <router-view v-slot="{ Component }">
      <component :is="Component" v-if="flag"></component>
    </router-view>
</template>

<style lang='scss' scoped>

</style>
